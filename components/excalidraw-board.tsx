"use client"

import dynamic from "next/dynamic"
import "@excalidraw/excalidraw/index.css"

const ExcalidrawComponent = dynamic(
  () => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <span className="font-sans text-sm text-muted-foreground">Loading...</span>
      </div>
    ),
  }
)

interface ExcalidrawBoardProps {
  onExit: () => void
}

export function ExcalidrawBoard({ onExit }: ExcalidrawBoardProps) {
  return (
    <div className="fixed inset-0 z-50">
      <ExcalidrawComponent />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
        <button
          onClick={onExit}
          className="bg-white border border-gray-200 shadow-md rounded-full px-4 py-1.5 text-sm font-sans text-gray-700 hover:text-red-500 hover:border-red-300 transition-colors"
        >
          exit
        </button>
      </div>
    </div>
  )
}
