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
  children: React.ReactNode
  title?: string
}) => {
  const [isCollapse] = useAtom(isCollapseAtom)
  const [, toogle] = useAtom(toggleCollapseAtom)
  const isTablet = useMedia("(max-width: 1024px)")

  return (
    <header className="flex min-h-10 min-w-0 shrink-0 items-center gap-3 border-b border-b-primary/5 py-1 pl-8 pr-6 transition-opacity max-lg:pl-4 max-lg:pr-5">
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
              onClick={() => toogle()}
            >
              <PanelLeftIcon size={16} />
            </Button>
            <Separator orientation="vertical" />
          </>
        )}

        {title && <div className="truncate text-sm font-medium">{title}</div>}
      </div>

      {children}
    </header>
  )
}
