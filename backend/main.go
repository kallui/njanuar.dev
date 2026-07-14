package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// CreateDoodleRequest is the JSON body the frontend will send.
// Your canvas already produces a data URL like:
//   "data:image/png;base64,iVBORw0KGgo..."
type CreateDoodleRequest struct {
	Artist     string `json:"artist"`
	AvatarSeed string `json:"avatar_seed"`
	Image      string `json:"image"` // data URL from canvas.toDataURL()
}

type DoodleEntry struct {
	ID         string    `json:"id"`
	Artist     string    `json:"artist"`
	AvatarSeed string    `json:"avatar_seed"`
	Filename   string    `json:"filename"`
	CreatedAt  time.Time `json:"created_at"`
}

func main() {
	// Ensure the folder that will hold PNG files exists.
	if err := os.MkdirAll("uploads", 0o755); err != nil {
		log.Fatalf("could not create uploads dir: %v", err)
	}
	if err := ensureIndex(); err != nil {
		log.Fatalf("could not initialize uploads/index.json: %v", err)
	}

	adminSecret := os.Getenv("ADMIN_SECRET")
	if adminSecret == "" {
		log.Fatal("ADMIN_SECRET env var is required")
	}

	// mux is Go's request router: path → handler function
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handleHealth)
	mux.HandleFunc("GET /api/doodles", handleListDoodles)
	mux.HandleFunc("POST /api/doodles", handleCreateDoodle)
	mux.HandleFunc("DELETE /api/doodles/{id}", handleDeleteDoodle(adminSecret))
	mux.Handle(
		"GET /uploads/",
		http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))),
	)

	hub := newHub()
	mux.HandleFunc("GET /ws", hub.handleWS)

	addr := ":8080"
	log.Printf("listening on http://localhost%s", addr)

	// ListenAndServe blocks forever, serving HTTP until the process exits.
	if err := http.ListenAndServe(addr, withCORS(mux)); err != nil {
		log.Fatal(err)
	}
}

// ensureIndex creates uploads/index.json as an empty list if it does not exist.
func ensureIndex() error {
	const path = "uploads/index.json"
	if _, err := os.Stat(path); err == nil {
		return nil
	} else if !os.IsNotExist(err) {
		return err
	}
	return os.WriteFile(path, []byte("[]\n"), 0o644)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"ok":true}`))
}

func handleListDoodles(w http.ResponseWriter, r *http.Request) {
	entries, err := loadIndex()
	if err != nil {
		http.Error(w, "failed to load doodles", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(entries); err != nil {
		log.Printf("encode response: %v", err)
	}
}

func loadIndex() ([]DoodleEntry, error) {
	content, err := os.ReadFile("uploads/index.json")
	if err != nil {
		return nil, err
	}

	var entries []DoodleEntry
	if err := json.Unmarshal(content, &entries); err != nil {
		return nil, err
	}

	return entries, nil
}

func handleCreateDoodle(w http.ResponseWriter, r *http.Request) {
	// Limit body size so someone can't POST a huge payload.
	r.Body = http.MaxBytesReader(w, r.Body, 2<<20) // 2 MiB

	var req CreateDoodleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}

	artist := strings.TrimSpace(req.Artist)
	if artist == "" {
		http.Error(w, "artist is required", http.StatusBadRequest)
		return
	}
	if len(artist) > 18 {
		http.Error(w, "artist too long", http.StatusBadRequest)
		return
	}

	avatarSeed := strings.TrimSpace(req.AvatarSeed)
	if avatarSeed == "" {
		http.Error(w, "avatar_seed is required", http.StatusBadRequest)
		return
	}
	if len(avatarSeed) > 64 {
		http.Error(w, "avatar_seed too long", http.StatusBadRequest)
		return
	}

	pngBytes, err := decodeDataURLPNG(req.Image)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := fmt.Sprintf("%d", time.Now().UnixNano())
	filename := id + ".png"
	path := filepath.Join("uploads", filename)

	if err := os.WriteFile(path, pngBytes, 0o644); err != nil {
		http.Error(w, "failed to save image", http.StatusInternalServerError)
		return
	}

	entry := DoodleEntry{
		ID:         id,
		Artist:     artist,
		AvatarSeed: avatarSeed,
		Filename:   filename,
		CreatedAt:  time.Now(),
	}

	entries, err := loadIndex()
	if err != nil {
		http.Error(w, "failed to load doodles", http.StatusInternalServerError)
		return
	}
	entries = append([]DoodleEntry{entry}, entries...)
	if err := saveIndex(entries); err != nil {
		http.Error(w, "failed to save doodles", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(entry); err != nil {
		log.Printf("encode response: %v", err)
	}
}

// handleDeleteDoodle returns a handler closed over the admin secret.
// Call: DELETE /api/doodles/{id}
// Header: Authorization: Bearer <ADMIN_SECRET>
func handleDeleteDoodle(secret string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check the Authorization header.
		// r.Header.Get returns "" if the header is absent.
		auth := r.Header.Get("Authorization")
		expected := "Bearer " + secret
		if auth != expected {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		// Go 1.22+: grab the {id} segment from the URL pattern.
		id := r.PathValue("id")
		if id == "" {
			http.Error(w, "missing id", http.StatusBadRequest)
			return
		}

		entries, err := loadIndex()
		if err != nil {
			http.Error(w, "failed to load index", http.StatusInternalServerError)
			return
		}

		// Find the entry and filter it out in one pass.
		var filename string
		filtered := entries[:0] // reuse the same backing array
		for _, e := range entries {
			if e.ID == id {
				filename = e.Filename
			} else {
				filtered = append(filtered, e)
			}
		}

		if filename == "" {
			http.Error(w, "doodle not found", http.StatusNotFound)
			return
		}

		// Delete PNG first, then update index.
		if err := os.Remove(filepath.Join("uploads", filename)); err != nil && !os.IsNotExist(err) {
			http.Error(w, "failed to delete image", http.StatusInternalServerError)
			return
		}
		if err := saveIndex(filtered); err != nil {
			http.Error(w, "failed to update index", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent) // 204 — success, no body
	}
}

func saveIndex(entries []DoodleEntry) error {
	data, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile("uploads/index.json", data, 0o644)
}

// decodeDataURLPNG turns "data:image/png;base64,...." into raw PNG bytes.
func decodeDataURLPNG(dataURL string) ([]byte, error) {
	const prefix = "data:image/png;base64,"
	if !strings.HasPrefix(dataURL, prefix) {
		return nil, fmt.Errorf("image must be a PNG data URL")
	}

	encoded := strings.TrimPrefix(dataURL, prefix)
	decoded, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return nil, fmt.Errorf("invalid base64 image data")
	}
	if len(decoded) == 0 {
		return nil, fmt.Errorf("empty image")
	}
	return decoded, nil
}

// withCORS lets the Vite frontend call this API during local dev.
// Vite may use 5173, 5174, … if the default port is taken.
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if strings.HasPrefix(origin, "http://localhost:") ||
			strings.HasPrefix(origin, "http://127.0.0.1:") {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
