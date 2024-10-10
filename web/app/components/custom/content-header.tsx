import * as React from "react"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { isCollapseAtom, toggleCollapseAtom } from "@/store/sidebar"
import { useMedia } from "@/hooks/use-media"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"

type ContentHeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">

export const ContentHeader = React.forwardRef<
  HTMLDivElement,
  ContentHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <header
      className={cn(
        "flex min-h-10 min-w-0 shrink-0 items-center gap-3 transition-opacity px-6 max-lg:px-4 py-3 border-b border-b-[var(--la-border-new)]",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </header>
  )
})

ContentHeader.displayName = "ContentHeader"

export const SidebarToggleButton: React.FC = () => {
  const [isCollapse] = useAtom(isCollapseAtom)
  const [, toggle] = useAtom(toggleCollapseAtom)
  const isTablet = useMedia("(max-width: 1024px)")

  if (!isCollapse && !isTablet) return null

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Menu"
        className="text-muted-foreground hover:bg-transparent cursor-default -ml-2"
        onClick={handleClick}
      >
        <LaIcon name="PanelLeft" />
      </Button>
    </div>
  )
}
