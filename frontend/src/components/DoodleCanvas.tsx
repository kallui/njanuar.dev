import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export const DOODLE_COLORS = [
  '#111111',
  '#8b5cf6',
  '#3b82f6',
  '#22a06b',
  '#f5a524',
] as const

const DOODLE_COLOR_LABELS: Record<(typeof DOODLE_COLORS)[number], string> = {
  '#111111': 'Black',
  '#8b5cf6': 'Purple',
  '#3b82f6': 'Blue',
  '#22a06b': 'Green',
  '#f5a524': 'Orange',
}

const BRUSH_SIZE_MIN = 2
const BRUSH_SIZE_MAX = 16
const HISTORY_LIMIT = 40

function pickRandomColor() {
  return DOODLE_COLORS[Math.floor(Math.random() * DOODLE_COLORS.length)]
}

export type DoodleCanvasHandle = {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
}

type DoodleCanvasProps = {
  locked?: boolean
}

type Tool = 'brush' | 'eraser' | 'fill'

function hexToRgba(hex: string): [number, number, number, number] {
  const value = hex.replace('#', '')
  const n = Number.parseInt(value, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]
}

function colorsMatch(
  data: Uint8ClampedArray,
  index: number,
  r: number,
  g: number,
  b: number,
  a: number,
) {
  return (
    data[index] === r &&
    data[index + 1] === g &&
    data[index + 2] === b &&
    data[index + 3] === a
  )
}

function floodFill(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cssX: number,
  cssY: number,
  fillHex: string,
) {
  const dpr = window.devicePixelRatio || 1
  const x = Math.floor(cssX * dpr)
  const y = Math.floor(cssY * dpr)
  const { width, height } = canvas

  if (x < 0 || y < 0 || x >= width || y >= height) return false

  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData
  const start = (y * width + x) * 4
  const targetR = data[start]
  const targetG = data[start + 1]
  const targetB = data[start + 2]
  const targetA = data[start + 3]
  const [fillR, fillG, fillB, fillA] = hexToRgba(fillHex)

  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return false
  }

  const stack: Array<[number, number]> = [[x, y]]

  while (stack.length > 0) {
    const [cx, cy] = stack.pop()!
    let px = cx

    while (
      px >= 0 &&
      colorsMatch(data, (cy * width + px) * 4, targetR, targetG, targetB, targetA)
    ) {
      px -= 1
    }
    px += 1

    let spanUp = false
    let spanDown = false

    while (
      px < width &&
      colorsMatch(data, (cy * width + px) * 4, targetR, targetG, targetB, targetA)
    ) {
      const index = (cy * width + px) * 4
      data[index] = fillR
      data[index + 1] = fillG
      data[index + 2] = fillB
      data[index + 3] = fillA

      if (cy > 0) {
        const up = ((cy - 1) * width + px) * 4
        if (colorsMatch(data, up, targetR, targetG, targetB, targetA)) {
          if (!spanUp) {
            stack.push([px, cy - 1])
            spanUp = true
          }
        } else {
          spanUp = false
        }
      }

      if (cy < height - 1) {
        const down = ((cy + 1) * width + px) * 4
        if (colorsMatch(data, down, targetR, targetG, targetB, targetA)) {
          if (!spanDown) {
            stack.push([px, cy + 1])
            spanDown = true
          }
        } else {
          spanDown = false
        }
      }

      px += 1
    }
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.putImageData(imageData, 0, 0)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return true
}

export const DoodleCanvas = forwardRef<DoodleCanvasHandle, DoodleCanvasProps>(
  function DoodleCanvas({ locked = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawingRef = useRef(false)
    const hasDrawnRef = useRef(false)
    const lastPointRef = useRef<{ x: number; y: number } | null>(null)
    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef(-1)

    const [color, setColor] = useState<string>(() => pickRandomColor())
    const [brushSize, setBrushSize] = useState(5)
    const [tool, setTool] = useState<Tool>('brush')
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)

    const colorRef = useRef(color)
    const brushSizeRef = useRef(brushSize)
    const toolRef = useRef(tool)

    useEffect(() => {
      colorRef.current = color
    }, [color])

    useEffect(() => {
      brushSizeRef.current = brushSize
    }, [brushSize])

    useEffect(() => {
      toolRef.current = tool
    }, [tool])

    const syncHistoryButtons = useCallback(() => {
      setCanUndo(historyIndexRef.current > 0)
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
    }, [])

    const getCtx = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      return { canvas, ctx }
    }, [])

    const fillWhite = useCallback(() => {
      const target = getCtx()
      if (!target) return
      const { canvas, ctx } = target
      const rect = canvas.getBoundingClientRect()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, rect.width, rect.height)
    }, [getCtx])

    const restoreSnapshot = useCallback(
      (snapshot: string) => {
        const target = getCtx()
        if (!target) return
        const { canvas, ctx } = target
        const rect = canvas.getBoundingClientRect()
        const image = new Image()
        image.onload = () => {
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          const dpr = window.devicePixelRatio || 1
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.drawImage(image, 0, 0, rect.width, rect.height)
        }
        image.src = snapshot
      },
      [getCtx],
    )

    const pushHistory = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const snapshot = canvas.toDataURL('image/png')
      const next = historyRef.current.slice(0, historyIndexRef.current + 1)
      next.push(snapshot)

      if (next.length > HISTORY_LIMIT) {
        next.shift()
        historyIndexRef.current = next.length - 1
      } else {
        historyIndexRef.current = next.length - 1
      }

      historyRef.current = next
      syncHistoryButtons()
    }, [syncHistoryButtons])

    const resetHistory = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      historyRef.current = [canvas.toDataURL('image/png')]
      historyIndexRef.current = 0
      hasDrawnRef.current = false
      syncHistoryButtons()
    }, [syncHistoryButtons])

    const clearCanvas = useCallback(() => {
      fillWhite()
      hasDrawnRef.current = false
      pushHistory()
    }, [fillWhite, pushHistory])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const paintWhite = (width: number, height: number) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
      }

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        const snapshot =
          historyIndexRef.current >= 0
            ? historyRef.current[historyIndexRef.current]
            : hasDrawnRef.current
              ? canvas.toDataURL('image/png')
              : null

        paintWhite(rect.width, rect.height)

        if (snapshot) {
          const image = new Image()
          image.onload = () => {
            ctx.drawImage(image, 0, 0, rect.width, rect.height)
          }
          image.src = snapshot
        } else if (historyRef.current.length === 0) {
          historyRef.current = [canvas.toDataURL('image/png')]
          historyIndexRef.current = 0
          syncHistoryButtons()
        }
      }

      resize()
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }, [syncHistoryButtons])

    useImperativeHandle(ref, () => ({
      clear: () => {
        fillWhite()
        resetHistory()
      },
      isEmpty: () => !hasDrawnRef.current,
      // Export at CSS size (not devicePixelRatio backing store) so saved
      // PNGs match the on-screen canvas, not a 2× retina bitmap.
      toDataURL: () => {
        const canvas = canvasRef.current
        if (!canvas) return ''

        const rect = canvas.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width))
        const height = Math.max(1, Math.round(rect.height))

        if (canvas.width === width && canvas.height === height) {
          return canvas.toDataURL('image/png')
        }

        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = width
        exportCanvas.height = height
        const exportCtx = exportCanvas.getContext('2d')
        if (!exportCtx) return canvas.toDataURL('image/png')

        exportCtx.fillStyle = '#ffffff'
        exportCtx.fillRect(0, 0, width, height)
        exportCtx.drawImage(canvas, 0, 0, width, height)
        return exportCanvas.toDataURL('image/png')
      },
    }))

    const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const stroke = (
      from: { x: number; y: number },
      to: { x: number; y: number },
    ) => {
      const target = getCtx()
      if (!target) return
      const { ctx } = target

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = brushSizeRef.current
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle =
        toolRef.current === 'eraser' ? '#ffffff' : colorRef.current

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()

      hasDrawnRef.current = true
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (locked) return

      const point = getPoint(event)

      if (toolRef.current === 'fill') {
        const target = getCtx()
        if (!target) return
        const filled = floodFill(
          target.ctx,
          target.canvas,
          point.x,
          point.y,
          colorRef.current,
        )
        if (filled) {
          hasDrawnRef.current = true
          pushHistory()
        }
        return
      }

      event.currentTarget.setPointerCapture(event.pointerId)
      drawingRef.current = true
      lastPointRef.current = point
      stroke(point, point)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        locked ||
        toolRef.current === 'fill' ||
        !drawingRef.current ||
        !lastPointRef.current
      ) {
        return
      }
      const point = getPoint(event)
      stroke(lastPointRef.current, point)
      lastPointRef.current = point
    }

    const handlePointerUp = () => {
      if (!drawingRef.current) return
      drawingRef.current = false
      lastPointRef.current = null
      if (!locked) pushHistory()
    }

    const handleUndo = () => {
      if (locked || historyIndexRef.current <= 0) return
      historyIndexRef.current -= 1
      const snapshot = historyRef.current[historyIndexRef.current]
      restoreSnapshot(snapshot)
      hasDrawnRef.current = historyIndexRef.current > 0
      syncHistoryButtons()
    }

    const handleRedo = () => {
      if (
        locked ||
        historyIndexRef.current >= historyRef.current.length - 1
      ) {
        return
      }
      historyIndexRef.current += 1
      const snapshot = historyRef.current[historyIndexRef.current]
      restoreSnapshot(snapshot)
      hasDrawnRef.current = historyIndexRef.current > 0
      syncHistoryButtons()
    }

    const selectColor = (swatch: string) => {
      setColor(swatch)
      if (tool === 'eraser') setTool('brush')
    }

    return (
      <div className={`doodle-canvas-wrap${locked ? ' is-locked' : ''}`}>
        <div className="doodle-toolbar" role="toolbar" aria-label="Doodle tools">
          <div className="doodle-tool-group">
            <button
              type="button"
              className="doodle-icon-btn has-tooltip"
              onClick={handleUndo}
              disabled={locked || !canUndo}
              aria-label="Undo"
              data-tooltip="Undo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="doodle-icon-btn has-tooltip"
              onClick={handleRedo}
              disabled={locked || !canRedo}
              aria-label="Redo"
              data-tooltip="Redo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22l2.36.78c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
                />
              </svg>
            </button>
          </div>

          <label
            className="doodle-brush-size has-tooltip"
            data-tooltip="Brush size"
          >
            <span className="doodle-brush-preview" aria-hidden="true">
              <span style={{ width: brushSize, height: brushSize }} />
            </span>
            <input
              type="range"
              min={BRUSH_SIZE_MIN}
              max={BRUSH_SIZE_MAX}
              value={brushSize}
              disabled={locked}
              aria-label="Brush size"
              onChange={(event) => setBrushSize(Number(event.target.value))}
            />
          </label>

          <div className="doodle-swatches">
            {DOODLE_COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className={`doodle-swatch has-tooltip${tool !== 'eraser' && color === swatch ? ' is-active' : ''}`}
                style={{ backgroundColor: swatch }}
                aria-label={DOODLE_COLOR_LABELS[swatch]}
                aria-pressed={tool !== 'eraser' && color === swatch}
                data-tooltip={DOODLE_COLOR_LABELS[swatch]}
                disabled={locked}
                onClick={() => selectColor(swatch)}
              />
            ))}
          </div>

          <div className="doodle-tool-group">
            <button
              type="button"
              className={`doodle-icon-btn has-tooltip${tool === 'brush' ? ' is-active' : ''}`}
              aria-pressed={tool === 'brush'}
              aria-label="Brush"
              data-tooltip="Brush"
              disabled={locked}
              onClick={() => setTool('brush')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 5 4 4"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`doodle-icon-btn has-tooltip${tool === 'fill' ? ' is-active' : ''}`}
              aria-pressed={tool === 'fill'}
              aria-label="Paint bucket"
              data-tooltip="Fill"
              disabled={locked}
              onClick={() => setTool('fill')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 2 5 5"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 13h15"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`doodle-icon-btn has-tooltip${tool === 'eraser' ? ' is-active' : ''}`}
              aria-pressed={tool === 'eraser'}
              aria-label="Eraser"
              data-tooltip="Eraser"
              disabled={locked}
              onClick={() => setTool('eraser')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 21H7"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 11 9 9"
                />
              </svg>
            </button>
            <button
              type="button"
              className="doodle-clear-btn has-tooltip"
              data-tooltip="Clear canvas"
              disabled={locked}
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>

          {locked && <span className="doodle-locked-label">Submitted</span>}
        </div>

        <canvas
          ref={canvasRef}
          className="doodle-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    )
  },
)
