import React, { useState, useRef, useEffect } from "react"
import Button from "@/components/Button"
import RangeInput from "@/components/RangeInput"
import ColorInput from "./components/ColorInput"

interface PathData {
  path: string
  lineColor: string
  lineWidth: number
  strokeColor: string
  strokeWidth: number
}

const DEFAULT_LINE_COLOR = "#000000"
const DEFAULT_STROKE_COLOR = "#ffff00"

export default function App() {
  const canvasRef = useRef<SVGSVGElement>(null)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [pathList, setPathList] = useState<PathData[]>([])
  const [lineColor, setLineColor] = useState<string>(DEFAULT_LINE_COLOR)
  const [lineWidth, setLineWidth] = useState<number>(5)
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_STROKE_COLOR)
  const [strokeWidth, setStrokeWidth] = useState<number>(3)
  const [removedItemList, setRemovedItemList] = useState<PathData[]>([])

  const canUndo = pathList.length > 0
  const canRedo = removedItemList.length > 0

  const getCanvasCoordinates = (
    e: React.MouseEvent<SVGSVGElement>,
  ): { x: number; y: number } | null => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) {
      return null
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<SVGSVGElement>): void => {
    const coords = getCanvasCoordinates(e)
    if (coords) {
      setIsDrawing(true)
      setCurrentPath(`M ${coords.x} ${coords.y}`)
    }
  }

  const draw = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!isDrawing) {
      return
    }

    const coords = getCanvasCoordinates(e)
    if (coords) {
      setIsDrawing(true)
      setCurrentPath((prev) => `${prev} L ${coords.x} ${coords.y}`)
    }
  }

  const stopDrawing = (): void => {
    if (isDrawing && currentPath) {
      setPathList((prev) => [
        ...prev,
        {
          path: currentPath,
          lineColor,
          strokeColor,
          lineWidth,
          strokeWidth,
        },
      ])
      setRemovedItemList([])
      setCurrentPath("")
    }
    setIsDrawing(false)
  }

  const clearCanvas = (): void => {
    setPathList([])
    setCurrentPath("")
    setRemovedItemList([])
  }

  const undo = (): void => {
    if (pathList.length === 0) {
      return
    }

    const removedItem = pathList[pathList.length - 1]
    const newList = pathList.slice(0, -1)

    setPathList(newList)
    setRemovedItemList((prev) => [removedItem, ...prev])
    setCurrentPath("")
  }

  const redo = (): void => {
    if (removedItemList.length === 0) {
      return
    }

    const itemToRestore = removedItemList[0]
    const newRemoved = removedItemList.slice(1)

    setPathList((prev) => [...prev, itemToRestore])
    setRemovedItemList(newRemoved)
    setCurrentPath("")
  }

  const exportSVG = (): void => {
    const svgElement = canvasRef.current
    if (!svgElement) {
      return
    }

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)

    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "drawing.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault()
          if (pathList.length > 0) {
            undo()
          }
        } else if (e.key === "y") {
          e.preventDefault()
          if (removedItemList.length > 0) {
            redo()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pathList.length, removedItemList.length])

  return (
    <div className="App min-h-screen bg-gray-100 p-8">
      <div className="flex flex-wrap gap-6 mt-6 mx-auto p-6 bg-white rounded-xl shadow-md max-w-[800px]">
        <ColorInput
          label="선 색상"
          value={lineColor}
          onChange={(value) => setLineColor(value)}
        />
        <ColorInput
          label="테두리 색상"
          value={strokeColor}
          onChange={(value) => setStrokeColor(value)}
        />
        <RangeInput
          label="선 두께"
          value={lineWidth}
          onChange={(value) => setLineWidth(value)}
          min={1}
          max={30}
          unit="px"
        />
        <RangeInput
          label="테두리 두께"
          value={strokeWidth}
          onChange={(value) => setStrokeWidth(value)}
          min={0}
          max={10}
          unit="px"
        />
        <div className="flex gap-3 ml-auto justify-center items-center">
          <Button
            onClick={undo}
            disabled={!canUndo}
            className={!canUndo ? "opacity-50 cursor-not-allowed" : ""}
          >
            실행 취소
          </Button>
          <Button
            onClick={redo}
            disabled={!canRedo}
            className={!canRedo ? "opacity-50 cursor-not-allowed" : ""}
          >
            다시 실행
          </Button>
          <Button onClick={clearCanvas}>초기화</Button>
          <Button onClick={exportSVG}>저장</Button>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center mt-6">
        <div className="bg-white rounded-xl shadow-lg">
          <svg
            ref={canvasRef}
            width="800"
            height="600"
            className="border-1 border-gray-300 cursor-crosshair rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          >
            {pathList.map((pathData, index) => (
              <>
                {pathData.strokeWidth > 0 && (
                  <path
                    key={`stroke-${index}`}
                    d={pathData.path}
                    fill="none"
                    stroke={pathData.strokeColor}
                    strokeWidth={pathData.lineWidth + pathData.strokeWidth * 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                <path
                  key={`path-${index}`}
                  d={pathData.path}
                  fill="none"
                  stroke={pathData.lineColor}
                  strokeWidth={pathData.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ))}
            {currentPath && (
              <>
                {strokeWidth > 0 && (
                  <path
                    d={currentPath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={lineWidth + strokeWidth * 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                <path
                  d={currentPath}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
