import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  BookOpen,
  Bookmark,
  GraduationCap,
  Check
} from "lucide-react"
import { SidebarItem } from "../sidebar"

const TOPICS = [
  "Nix",
  "Javascript",
  "Kubernetes",
  "Figma",
  "Hiring",
  "Java",
  "IOS",
  "Design"
]

const TopicSection = () => {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const learningOptions = [
    { text: "To Learn", icon: <Bookmark size={16} />, color: "text-white/70" },
    {
      text: "Learning",
      icon: <GraduationCap size={16} />,
      color: "text-[#D29752]"
    },
    {
      text: "Learned",
      icon: <Check size={16} />,
      color: "text-[#708F51]"
    }
  ]

  const statusSelect = (status: string) => {
    setSelectedStatus(status === "Show All" ? null : status)
    setShowOptions(false)
  }

  useEffect(() => {
    const overlayClick = (event: MouseEvent) => {
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }

    document.addEventListener("mousedown", overlayClick)
    return () => {
      document.removeEventListener("mousedown", overlayClick)
    }
  }, [])

  const availableOptions = selectedStatus
    ? [
        {
          text: "Show All",
          icon: <BookOpen size={16} />,
          color: "text-white"
        },
        ...learningOptions.filter((option) => option.text !== selectedStatus)
      ]
    : learningOptions

  // const topicClick = (topic: string) => {
  //   router.push(`/${topic.toLowerCase()}`)
  // }

  return (
    <div className="space-y-1 overflow-hidden" ref={sectionRef}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50"
      >
        <span>{selectedStatus ? `Topics: ${selectedStatus}` : "Topics"}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ease-in-out ${
            showOptions ? "rotate-0" : "rotate-[-90deg]"
          }`}
        />
      </Button>

      {showOptions && (
        <div className="rounded-md bg-neutral-800">
          {availableOptions.map((option) => (
            <Button
              key={option.text}
              onClick={() => statusSelect(option.text)}
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-700 ${option.color} bg-inherit`}
            >
              {option.icon && (
                <span className={option.color}>{option.icon}</span>
              )}
              <span>{option.text}</span>
            </Button>
          ))}
        </div>
      )}
      <div
        className="scrollbar-hide space-y-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {TOPICS.map((topic) => (
          <SidebarItem key={topic} label={topic} url={`/${topic}`} />
        ))}
      </div>
    </div>
  )
}

export default TopicSection
