"use client"
import React, { useState } from "react"
import { ContentHeader } from "@/components/custom/content-header"
import { PiLinkSimple } from "react-icons/pi"
// import { GraduationCap, Check } from "lucide-react"

interface LinkProps {
  title: string
  url: string
}

const links = [
  { title: "JavaScript", url: "https://justjavascript.com" },
  { title: "TypeScript", url: "https://www.typescriptlang.org/" },
  { title: "React", url: "https://reactjs.org/" }
]

const LinkItem: React.FC<LinkProps> = ({ title, url }) => (
  <div className="mb-1 flex flex-row items-center justify-between rounded-xl bg-[#121212] px-2 py-4 hover:cursor-pointer">
    <div className="flex items-center space-x-4">
      <p>{title}</p>
      <span className="text-md flex flex-row items-center space-x-1 font-medium tracking-wide text-white/20 hover:opacity-50">
        <PiLinkSimple size={20} className="text-white/20" />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {new URL(url).hostname}
        </a>
      </span>
    </div>
  </div>
)

const Button = ({
  children,
  onClick,
  className = ""
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      className={`flex items-center justify-between rounded px-3 py-1 text-sm font-medium ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function GlobalTopic({ topic }: { topic: string }) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("Guide")

  const decodedTopic = decodeURIComponent(topic)

  const selectedStatus = (option: string) => {
    setSelectedOption(option)
    setShowOptions(false)
  }

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <ContentHeader>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">{decodedTopic}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg bg-neutral-800 bg-opacity-60">
              <button
                onClick={() => setActiveTab("Guide")}
                className={`px-4 py-2 text-[16px] font-semibold transition-colors ${
                  activeTab === "Guide"
                    ? "rounded-lg bg-neutral-800 shadow-inner shadow-neutral-700/70"
                    : "text-white/70"
                }`}
              >
                Guide
              </button>
              <button
                onClick={() => setActiveTab("All links")}
                className={`px-4 py-2 text-[16px] font-semibold transition-colors ${
                  activeTab === "All links"
                    ? "rounded-lg bg-neutral-800 shadow-inner shadow-neutral-700/70"
                    : "text-white/70"
                }`}
              >
                All links
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <Button
            onClick={() => setShowOptions(!showOptions)}
            className="w-[150px] rounded-[7px] bg-neutral-800 px-4 py-2 text-[17px] font-semibold text-white/70 shadow-inner shadow-neutral-700/50 transition-colors hover:bg-neutral-700"
          >
            {selectedOption || "Add to my profile"}
          </Button>
          {showOptions && (
            <div className="absolute left-1/2 mt-1 w-40 -translate-x-1/2 rounded-lg bg-neutral-800 shadow-lg">
              {["To Learn", "Learning", "Learned"].map((option) => (
                <Button
                  key={option}
                  onClick={() => selectedStatus(option)}
                  className="w-full text-left text-[17px] font-semibold hover:bg-neutral-700"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </ContentHeader>
      <div className="px-5 py-3">
        <h2 className="mb-3 text-white/60">Intro</h2>
        {links.map((link, index) => (
          <LinkItem key={index} title={link.title} url={link.url} />
        ))}
      </div>
      <div className="px-5 py-3">
        <h2 className="mb-3 text-opacity-60">Other</h2>
        {links.map((link, index) => (
          <LinkItem key={index} title={link.title} url={link.url} />
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4"></div>
    </div>
  )
}
