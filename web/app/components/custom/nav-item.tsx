import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { LaIcon } from "~/components/custom/la-icon"
import { icons } from "lucide-react"
import type { NavigateOptions } from "@tanstack/react-router"

interface NavItemProps extends NavigateOptions {
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
        "flex h-8 items-center cursor-default gap-px rounded-md px-2 text-[13px] font-medium",
        "hover:bg-[var(--item-hover)] text-[var(--less-foreground)] focus-visible:outline-none focus-visible:ring-0 sm:h-7",
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
          <div className="flex items-center gap-1.5 ">
            <LaIcon
              name={icon}
              className={cn("size-3.5 group-hover/p:text-foreground", {
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
