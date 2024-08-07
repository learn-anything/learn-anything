"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "../ui/button"
import { PanelLeftIcon } from "lucide-react"
import { useAtom } from "jotai"
import { isCollapseAtom, toggleCollapseAtom } from "@/store/sidebar"
import { useMedia } from "react-use"
import { cn } from "@/lib/utils"

type ContentHeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">

export const ContentHeader = React.forwardRef<
  HTMLDivElement,
  ContentHeaderProps
>(({ children, className, ...props }, ref) => {
  return (
    <header
      className={cn(
        "flex min-h-10 min-w-0 max-w-[100vw] shrink-0 items-center gap-3 border border-b pl-8 pr-6 transition-opacity max-lg:pl-4 max-lg:pr-5",
        className
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
        className="z-50 text-primary/60"
        onClick={handleClick}
      >
        <PanelLeftIcon size={16} />
      </Button>
      <Separator orientation="vertical" />
    </div>
  )
}
