import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { SidebarItem } from "../sidebar"

const PAGES = [
  "Nix",
  "Javascript",
  "Kubernetes",
  "Figma",
  "Hiring",
  "Java",
  "IOS",
  "Design"
]

export const PageSection: React.FC = () => (
  <div className="-ml-2">
    <div className="group mb-0.5 ml-2 mt-2 flex cursor-pointer flex-row items-center justify-between rounded-md">
      <div
        role="button"
        tabIndex={0}
        className="flex h-6 grow items-center justify-between gap-x-0.5 self-start rounded-md px-1 text-xs font-medium text-primary/50"
      >
        <span className="group-hover:text-muted-foreground">Pages</span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="New Page"
          className="size-6"
        >
          <PlusIcon size={16} />
        </Button>
      </div>
    </div>
    <div className="relative shrink-0">
      <div aria-hidden="false" className="ml-2 shrink-0 pb-2">
        {PAGES.map((page) => (
          <SidebarItem key={page} url={`/${page}`} label={page} />
        ))}
      </div>
    </div>
  </div>
)
