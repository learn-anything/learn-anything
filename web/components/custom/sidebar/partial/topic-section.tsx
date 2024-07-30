import { ChevronDownIcon } from "lucide-react"
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

export const TopicSection: React.FC = () => (
  <div className="-ml-2">
    <div className="mb-0.5 ml-2 mt-2 flex cursor-pointer flex-row items-center justify-between rounded-md hover:bg-primary/10">
      <div
        role="button"
        tabIndex={0}
        className="flex h-6 grow items-center gap-x-0.5 self-start rounded-md px-1 text-xs font-medium text-primary/50"
      >
        <span>Topics</span>
        <ChevronDownIcon size={16} />
      </div>
    </div>
    <div className="relative shrink-0">
      <div aria-hidden="false" className="ml-2 shrink-0 pb-2">
        {TOPICS.map((page) => (
          <SidebarItem key={page} url={`/${page}`} label={page} />
        ))}
      </div>
    </div>
  </div>
)
