package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	maxConnections    = 40
	maxCursorsPerPage = 12
	maxMessageBytes   = 4 << 10 // 4 KiB
	idleTimeout       = 90 * time.Second
	cursorMinInterval = time.Second / 12 // ~12 Hz
	writeWait         = 10 * time.Second
	pingPeriod        = 30 * time.Second
	maxDisplayNameLen = 18
	maxAvatarSeedLen  = 64
	maxColorLen       = 32
	maxPageLen        = 128
	maxGuestIDLen     = 64
)

type peerPublic struct {
	ID          string `json:"id"`
	DisplayName string `json:"display_name"`
	AvatarSeed  string `json:"avatar_seed"`
	Color       string `json:"color"`
	Page        string `json:"page"`
	CursorOK    bool   `json:"cursor_ok"`
}

type inboundMessage struct {
	Type        string  `json:"type"`
	ID          string  `json:"id,omitempty"`
	DisplayName string  `json:"display_name,omitempty"`
	AvatarSeed  string  `json:"avatar_seed,omitempty"`
	Color       string  `json:"color,omitempty"`
	Page        string  `json:"page,omitempty"`
	X           float64 `json:"x,omitempty"`
	Y           float64 `json:"y,omitempty"`
}

type outboundMessage struct {
	Type    string       `json:"type"`
	Peers   []peerPublic `json:"peers,omitempty"`
	Peer    *peerPublic  `json:"peer,omitempty"`
	ID      string       `json:"id,omitempty"`
	Page    string       `json:"page,omitempty"`
	X       float64      `json:"x,omitempty"`
	Y       float64      `json:"y,omitempty"`
	Message string       `json:"message,omitempty"`
}

type client struct {
	hub          *Hub
	conn         *websocket.Conn
	send         chan []byte
	guestID      string
	displayName  string
	avatarSeed   string
	color        string
	page         string
	joined       bool
	lastCursorAt time.Time
	mu           sync.Mutex
}

type Hub struct {
	mu      sync.Mutex
	clients map[*client]struct{}
}

func newHub() *Hub {
	return &Hub{clients: make(map[*client]struct{})}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     allowedWSOrigin,
}

func allowedWSOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	}
	if strings.HasPrefix(origin, "http://localhost:") ||
		strings.HasPrefix(origin, "http://127.0.0.1:") {
		return true
	}
	if origin == "https://njanuar.dev" || origin == "https://www.njanuar.dev" {
		return true
	}
	return false
}

func (h *Hub) handleWS(w http.ResponseWriter, r *http.Request) {
	h.mu.Lock()
	atCap := len(h.clients) >= maxConnections
	h.mu.Unlock()
	if atCap {
		http.Error(w, "presence full", http.StatusServiceUnavailable)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade: %v", err)
		return
	}
	conn.SetReadLimit(maxMessageBytes)

	c := &client{
		hub:  h,
		conn: conn,
		send: make(chan []byte, 32),
	}

	h.mu.Lock()
	if len(h.clients) >= maxConnections {
		h.mu.Unlock()
		_ = conn.WriteMessage(
			websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseTryAgainLater, "presence full"),
		)
		_ = conn.Close()
		return
	}
	h.clients[c] = struct{}{}
	h.mu.Unlock()

	go c.writePump()
	c.readPump()
}

func (c *client) readPump() {
	defer func() {
		c.hub.unregister(c)
		_ = c.conn.Close()
	}()

	_ = c.conn.SetReadDeadline(time.Now().Add(idleTimeout))
	c.conn.SetPongHandler(func(string) error {
		return c.conn.SetReadDeadline(time.Now().Add(idleTimeout))
	})

	for {
		_, data, err := c.conn.ReadMessage()
		if err != nil {
			break
		}
		_ = c.conn.SetReadDeadline(time.Now().Add(idleTimeout))

		var msg inboundMessage
		if err := json.Unmarshal(data, &msg); err != nil {
			c.sendJSON(outboundMessage{Type: "error", Message: "invalid json"})
			continue
		}

		switch msg.Type {
		case "hello":
			c.handleHello(msg)
		case "profile":
			c.handleProfile(msg)
		case "page":
			c.handlePage(msg)
		case "cursor":
			c.handleCursor(msg)
		case "ping":
			c.sendJSON(outboundMessage{Type: "pong"})
		default:
			c.sendJSON(outboundMessage{Type: "error", Message: "unknown type"})
		}
	}
}

func (c *client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *client) sendJSON(v outboundMessage) {
	data, err := json.Marshal(v)
	if err != nil {
		return
	}
	select {
	case c.send <- data:
	default:
		// Slow client — drop rather than block the hub.
	}
}

func (c *client) handleHello(msg inboundMessage) {
	id := strings.TrimSpace(msg.ID)
	name := strings.TrimSpace(msg.DisplayName)
	seed := strings.TrimSpace(msg.AvatarSeed)
	color := strings.TrimSpace(msg.Color)
	page := normalizePage(msg.Page)

	if id == "" || len(id) > maxGuestIDLen ||
		name == "" || len(name) > maxDisplayNameLen ||
		seed == "" || len(seed) > maxAvatarSeedLen ||
		color == "" || len(color) > maxColorLen {
		c.sendJSON(outboundMessage{Type: "error", Message: "invalid hello"})
		return
	}

	c.mu.Lock()
	wasJoined := c.joined
	c.guestID = id
	c.displayName = name
	c.avatarSeed = seed
	c.color = color
	c.page = page
	c.joined = true
	c.mu.Unlock()

	if !wasJoined {
		c.sendJSON(outboundMessage{Type: "roster", Peers: c.hub.rosterFor(c)})
		peer := c.hub.peerView(c)
		c.hub.broadcastExcept(c, outboundMessage{Type: "peer_join", Peer: &peer})
	} else {
		peer := c.hub.peerView(c)
		c.hub.broadcastExcept(c, outboundMessage{Type: "peer_update", Peer: &peer})
	}
}

func (c *client) handleProfile(msg inboundMessage) {
	if !c.isJoined() {
		c.sendJSON(outboundMessage{Type: "error", Message: "say hello first"})
		return
	}

	name := strings.TrimSpace(msg.DisplayName)
	seed := strings.TrimSpace(msg.AvatarSeed)
	color := strings.TrimSpace(msg.Color)

	c.mu.Lock()
	if name != "" && len(name) <= maxDisplayNameLen {
		c.displayName = name
	}
	if seed != "" && len(seed) <= maxAvatarSeedLen {
		c.avatarSeed = seed
	}
	if color != "" && len(color) <= maxColorLen {
		c.color = color
	}
	c.mu.Unlock()

	peer := c.hub.peerView(c)
	c.hub.broadcastExcept(c, outboundMessage{Type: "peer_update", Peer: &peer})
}

func (c *client) handlePage(msg inboundMessage) {
	if !c.isJoined() {
		c.sendJSON(outboundMessage{Type: "error", Message: "say hello first"})
		return
	}
	page := normalizePage(msg.Page)
	c.mu.Lock()
	c.page = page
	c.mu.Unlock()

	peer := c.hub.peerView(c)
	c.hub.broadcastExcept(c, outboundMessage{Type: "peer_update", Peer: &peer})
}

func (c *client) handleCursor(msg inboundMessage) {
	if !c.isJoined() {
		return
	}
	if msg.X < 0 || msg.X > 1 || msg.Y < 0 || msg.Y > 1 {
		return
	}

	c.mu.Lock()
	if time.Since(c.lastCursorAt) < cursorMinInterval {
		c.mu.Unlock()
		return
	}
	c.lastCursorAt = time.Now()
	page := c.page
	id := c.guestID
	c.mu.Unlock()

	if !c.hub.cursorOK(c, page) {
		return
	}

	c.hub.broadcastSamePage(c, page, outboundMessage{
		Type: "cursor",
		ID:   id,
		Page: page,
		X:    msg.X,
		Y:    msg.Y,
	})
}

func (c *client) isJoined() bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.joined
}

func (c *client) snapshotIdentity() (id, name, seed, color, page string, joined bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.guestID, c.displayName, c.avatarSeed, c.color, c.page, c.joined
}

func (h *Hub) peerView(c *client) peerPublic {
	id, name, seed, color, page, _ := c.snapshotIdentity()
	return peerPublic{
		ID:          id,
		DisplayName: name,
		AvatarSeed:  seed,
		Color:       color,
		Page:        page,
		CursorOK:    h.cursorOK(c, page),
	}
}

func (h *Hub) snapshotClients() []*client {
	h.mu.Lock()
	defer h.mu.Unlock()
	out := make([]*client, 0, len(h.clients))
	for c := range h.clients {
		out = append(out, c)
	}
	return out
}

func (h *Hub) unregister(c *client) {
	id, _, _, _, _, joined := c.snapshotIdentity()

	h.mu.Lock()
	_, ok := h.clients[c]
	if ok {
		delete(h.clients, c)
	}
	h.mu.Unlock()

	close(c.send)

	if !ok || !joined || id == "" {
		return
	}

	stillHere := false
	for _, other := range h.snapshotClients() {
		oid, _, _, _, _, ojoined := other.snapshotIdentity()
		if ojoined && oid == id {
			stillHere = true
			break
		}
	}
	if !stillHere {
		h.broadcastAll(outboundMessage{Type: "peer_leave", ID: id})
	}
}

func (h *Hub) rosterFor(self *client) []peerPublic {
	clients := h.snapshotClients()
	peers := make([]peerPublic, 0, len(clients))
	for _, c := range clients {
		if c == self {
			continue
		}
		_, _, _, _, _, joined := c.snapshotIdentity()
		if !joined {
			continue
		}
		peers = append(peers, h.peerView(c))
	}
	return peers
}

func (h *Hub) broadcastExcept(self *client, msg outboundMessage) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}
	for _, c := range h.snapshotClients() {
		if c == self {
			continue
		}
		_, _, _, _, _, joined := c.snapshotIdentity()
		if !joined {
			continue
		}
		select {
		case c.send <- data:
		default:
		}
	}
}

func (h *Hub) broadcastAll(msg outboundMessage) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}
	for _, c := range h.snapshotClients() {
		_, _, _, _, _, joined := c.snapshotIdentity()
		if !joined {
			continue
		}
		select {
		case c.send <- data:
		default:
		}
	}
}

func (h *Hub) broadcastSamePage(self *client, page string, msg outboundMessage) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}
	for _, c := range h.snapshotClients() {
		if c == self {
			continue
		}
		_, _, _, _, cpage, joined := c.snapshotIdentity()
		if !joined || cpage != page {
			continue
		}
		select {
		case c.send <- data:
		default:
		}
	}
}

// cursorOK allows cursor fanout while under the per-page cap (others on page < max).
func (h *Hub) cursorOK(target *client, page string) bool {
	count := 0
	for _, c := range h.snapshotClients() {
		if c == target {
			continue
		}
		_, _, _, _, cpage, joined := c.snapshotIdentity()
		if joined && cpage == page {
			count++
		}
	}
	return count < maxCursorsPerPage
}

func normalizePage(page string) string {
	page = strings.TrimSpace(page)
	if page == "" || len(page) > maxPageLen {
		return "/"
	}
	if !strings.HasPrefix(page, "/") {
		page = "/" + page
	}
	return page
}
