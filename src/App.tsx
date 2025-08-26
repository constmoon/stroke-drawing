import React, { useState, useRef } from "react"
import Button from "@/components/Button"
import RangeInput from "@/components/RangeInput"

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
      setCurrentPath("")
    }
    setIsDrawing(false)
  }

  const clearCanvas = (): void => {
    setPathList([])
    setCurrentPath("")
  }

  return (
    <div className="App min-h-screen bg-gray-100 p-8">
      <h2 className="text-lg text-gray-600">
        Start editing to see some magic happen!
      </h2>
      <div className="flex flex-wrap gap-6 mt-6 p-6 bg-white rounded-xl shadow-md">
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
        <div className="flex w-full gap-3 justify-center items-center">
          <Button onClick={clearCanvas}>초기화</Button>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center mt-6">
        <div className="bg-white rounded-xl shadow-lg p-3">
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
                <path
                  key={`path-${index}`}
                  d={pathData.path}
                  fill="none"
                  stroke={pathData.lineColor}
                  strokeWidth={pathData.lineWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {pathData.strokeWidth > 0 && (
                  <path
                    key={`stroke-${index}`}
                    d={pathData.path}
                    fill="none"
                    stroke={pathData.strokeColor}
                    strokeWidth={pathData.lineWidth + pathData.strokeWidth * 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ mixBlendMode: "multiply" }}
                  />
                )}
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
                    style={{ mixBlendMode: "multiply" }}
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
