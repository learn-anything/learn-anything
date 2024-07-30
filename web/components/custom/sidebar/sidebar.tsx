"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMedia } from "react-use"
import { useAtom } from "jotai"
import { LinkIcon, SearchIcon } from "lucide-react"
import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { isCollapseAtom } from "@/store/sidebar"
import { PageSection } from "./partial/page-section"
import { TopicSection } from "./partial/topic-section"

interface SidebarItemProps {
  label: string
  url: string
  icon?: React.ReactNode
}

const SidebarContext = React.createContext<{
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}>({
  isCollapsed: false,
  setIsCollapsed: () => {}
})

export const Sidebar: React.FC = () => {
  const account = useAccount()
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapseAtom)
  const isTablet = useMedia("(max-width: 1024px)")
  const pathname = usePathname()

  React.useEffect(() => {
    if (isTablet) setIsCollapsed(true)
  }, [pathname, setIsCollapsed])

  React.useEffect(() => {
    setIsCollapsed(isTablet)
  }, [isTablet, setIsCollapsed])

  const sidebarContent = (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <nav className="relative flex h-full w-full shrink-0 flex-col bg-background">
        <div className={cn({ "pt-12": !isCollapsed && isTablet })}>
          <LogoAndSearch />
        </div>
        <div
          tabIndex={-1}
          className="relative mb-0.5 mt-1.5 flex grow flex-col overflow-y-auto rounded-md px-3.5"
        >
          <SidebarItem
            url="/links"
            label="Links"
            icon={<LinkIcon size={16} />}
          />
          <div className="h-2 shrink-0" />
          <PageSection />
          <TopicSection />
        </div>
      </nav>
    </SidebarContext.Provider>
  )

  const sidebarClasses = cn(
    "h-full overflow-hidden transition-all duration-300 ease-in-out",
    isCollapsed ? "w-0" : "w-auto min-w-56"
  )

  const sidebarInnerClasses = cn(
    "h-full w-auto min-w-56 transition-transform duration-300 ease-in-out",
    isCollapsed ? "-translate-x-full" : "translate-x-0"
  )

  if (isTablet) {
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-30 bg-black/40 transition-opacity duration-300",
            isCollapsed ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          onClick={() => setIsCollapsed(true)}
        />
        <div
          className={cn(
            "fixed left-0 top-0 z-40 h-full",
            sidebarClasses,
            !isCollapsed &&
              "shadow-[4px_0px_16px_rgba(0,0,0,0.1)] transition-all"
          )}
        >
          <div
            className={cn(sidebarInnerClasses, "border-r border-r-primary/5")}
          >
            {sidebarContent}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={sidebarClasses}>
      <div className={sidebarInnerClasses}>{sidebarContent}</div>
    </div>
  )
}

const LogoAndSearch: React.FC = () => {
  const pathname = usePathname()
  return (
    <div className="px-3.5">
      <div className="mb-1 mt-2 flex h-10 max-w-full items-center">
        <Link href="/links" className="px-2">
          <Logo className="size-7" />
        </Link>
        <div className="flex min-w-2 grow flex-row" />
        {pathname === "/search" ? (
          <Link href="/links">
            <Button
              size="sm"
              variant="secondary"
              type="button"
              className="text-md font-medium text-primary/60"
            >
              ← Back
            </Button>
          </Link>
        ) : (
          <Link href="/search">
            <Button
              size="sm"
              variant="secondary"
              aria-label="Search"
              type="button"
              className="flex w-20 items-center justify-start py-4 pl-2 text-primary/60"
            >
              <SearchIcon size={16} className="mr-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  url,
  icon
}) => {
  const pathname = usePathname()
  const isActive = pathname === url

  return (
    <div
      className={cn("group relative my-0.5 rounded-md", {
        "bg-secondary/80": isActive,
        "hover:bg-secondary/40": !isActive
      })}
    >
      <Link
        className="flex h-8 grow items-center truncate rounded-md pl-1.5 pr-1 text-sm font-medium text-secondary-foreground"
        href={url}
      >
        {icon && (
          <span
            className={cn(
              "mr-2 size-4 text-primary/60 group-hover:text-primary",
              { "text-primary": isActive }
            )}
          >
            {icon}
          </span>
        )}
        <span>{label}</span>
      </Link>
    </div>
  )
}
