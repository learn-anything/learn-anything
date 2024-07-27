"use client"

import { isCollapseAtom, toggleCollapseAtom } from "@/store/sidebar"
import { useAtom } from "jotai"
import { useMedia } from "react-use"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const ContentHeader = ({
  children,
  title
}: {
  children?: React.ReactNode
  title?: string
}) => {
  const [isCollapse] = useAtom(isCollapseAtom)
  const [, toogle] = useAtom(toggleCollapseAtom)
  const isTablet = useMedia("(max-width: 1024px)")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toogle()
  }

  return (
    <header className="// flex min-h-10 min-w-0 shrink-0 items-center gap-3 px-2 py-4 transition-opacity max-lg:px-4">
      <div
        className="flex min-h-10 min-w-0 shrink-0 items-center gap-1.5"
        style={{ maxWidth: "50%" }}
      >
        {(isCollapse || isTablet) && (
          <>
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
          </>
        )}

        {title && <p className="truncate text-2xl font-bold">{title}</p>}
      </div>

      {children}
    </header>
  )
}
