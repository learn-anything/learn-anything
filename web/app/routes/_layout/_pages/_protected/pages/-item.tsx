import * as React from "react"
import { cn } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema"
import { Badge } from "@/components/ui/badge"
import { useMedia } from "@/hooks/use-media"
import { format } from "date-fns"
import { Column } from "~/components/custom/column"
import { Link, useNavigate } from "@tanstack/react-router"
import { useColumnStyles } from "./-list"

interface PageItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  page: PersonalPage
  isActive: boolean
}

export const PageItem = React.forwardRef<HTMLAnchorElement, PageItemProps>(
  ({ page, isActive, ...props }, ref) => {
    const isTablet = useMedia("(max-width: 640px)")
    const columnStyles = useColumnStyles()
    const navigate = useNavigate()

    const handleKeyDown = React.useCallback(
      (ev: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (ev.key === "Enter") {
          ev.preventDefault()
          ev.stopPropagation()
          navigate({ to: `/pages/${page.id}` })
        }
      },
      [navigate, page.id],
    )

    return (
      <Link
        ref={ref}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          "relative block cursor-default outline-none",
          "min-h-12 py-2 sm:px-6 max-lg:px-4",
          "data-[active='true']:bg-[var(--link-background-muted-new)] data-[keyboard-active='true']:focus-visible:shadow-[var(--link-shadow)_0px_0px_0px_1px_inset]",
        )}
        to={`/pages/${page.id}`}
        aria-selected={isActive}
        data-active={isActive}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className="flex h-full items-center gap-4">
          <Column.Wrapper style={columnStyles.title}>
            <Column.Text className="truncate text-sm font-medium">
              {page.title || "Untitled"}
            </Column.Text>
          </Column.Wrapper>

          <Column.Wrapper style={columnStyles.topic}>
            {page.topic && (
              <Badge variant="secondary">{page.topic.prettyName}</Badge>
            )}
          </Column.Wrapper>

          {!isTablet && (
            <Column.Wrapper style={columnStyles.updated}>
              <Column.Text>
                {format(new Date(page.updatedAt), "d MMM yyyy")}
              </Column.Text>
            </Column.Wrapper>
          )}
        </div>
      </Link>
    )
  },
)

PageItem.displayName = "PageItem"
