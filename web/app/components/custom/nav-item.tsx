import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { LaIcon } from "~/components/custom/la-icon"
import { icons } from "lucide-react"
import type { LinkOptions } from "@tanstack/react-router"

interface NavItemProps extends LinkOptions {
  title: string
  count: number
  icon: keyof typeof icons
  className?: string
}

export function NavItem({
  title,
  count,
  icon,
  className,
  ...linkProps
}: NavItemProps) {
  return (
    <Link
      className={cn(
        "group/p",
        "flex h-[30px] cursor-default items-center gap-px rounded-md px-2 text-sm font-medium",
        "text-[var(--less-foreground)] hover:bg-[var(--item-hover)] focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
      activeProps={{
        className:
          'bg-[var(--item-active)] data-[status="active"]:hover:bg-[var(--item-active)]',
      }}
      {...linkProps}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-1.5">
            <LaIcon
              name={icon}
              className={cn("group-hover/p:text-foreground", {
                "text-foreground": isActive,
                "text-muted-foreground": !isActive,
              })}
            />
            <span>{title}</span>
          </div>
          <span className="flex-grow" />
          {count > 0 && <BadgeCount count={count} isActive={isActive} />}
        </>
      )}
    </Link>
  )
}

interface BadgeCountProps {
  count: number
  isActive: boolean
}

function BadgeCount({ count, isActive }: BadgeCountProps) {
  return (
    <span
      className={cn("font-mono", {
        "text-muted-foreground": !isActive,
        "text-foreground": isActive,
      })}
    >
      {count}
    </span>
  )
}
