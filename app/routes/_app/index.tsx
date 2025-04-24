import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import Sidebar from "~/components/Sidebar"
import { WebsiteElement } from "~/components/TreeItem"
import User from "~/components/User"

function RouteComponent() {
  const [selectedElements, setSelectedElements] = useState<WebsiteElement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(250)

  const analyzeSelection = (elements: WebsiteElement[]) => {
    setSelectedElements(elements)
    setIsAnalyzing(true)

    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResult(
        `Analyzed ${elements.length} elements:\n` +
          elements
            .map(
              (el) => `- ${el.name} (${el.type}${el.url ? `: ${el.url}` : ""})`,
            )
            .join("\n"),
      )
    }, 1500)
  }

  const changeSidebarWidth = (width: number) => {
    setSidebarWidth(width)
  }

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.4
      if (sidebarWidth > maxWidth) {
        setSidebarWidth(maxWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarWidth])

  return (
    <div className="flex h-screen">
      <Sidebar
        onAnalyzeSelection={analyzeSelection}
        width={sidebarWidth}
        onWidthChange={changeSidebarWidth}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hello world</h1>
          <User />
        </div>

        {selectedElements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Selected elements</h2>
            <div className="bg-white/5 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {selectedElements.map((el) => (
                  <li key={el.id}>
                    <span className="font-medium">{el.name}</span>
                    <span className="text-sm text-gray-400 ml-2">
                      ({el.type})
                    </span>
                    {el.url && (
                      <span className="text-sm text-blue-400 ml-2">
                        {el.url}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedElements.length > 0 ? (
          <p className="text-center text-gray-400 mt-10">
            Selected elements: {selectedElements.length}
          </p>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            Select elements in the sidebar for analysis
          </p>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})
