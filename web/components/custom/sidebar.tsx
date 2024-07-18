"use client"

import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import * as React from "react"
import { ChevronDownIcon, InboxIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAtom } from "jotai"
import { isCollapseAtom } from "@/store/sidebar"
import { usePathname } from "next/navigation"

interface SidebarItemProps {
  label: string
  url: string
  icon?: React.ReactNode | string
}

const PAGES = [
  "EP 2024",
  "Ableton 12",
  "Householding",
  "ADHD",
  "Javscript",
  "Hiring",
  "IOS",
  "Drugs",
  "Hiking",
  "Kubernetes",
  "Java",
  "Design"
]

export const Sidebar = () => {
  const account = useAccount()
  const [isCollapse, setIsCollapse] = useAtom(isCollapseAtom)
  const isTablet = useMediaQuery("(max-width: 1024px)")

  React.useEffect(() => {
    setIsCollapse(isTablet)
  }, [isTablet])

  return (
    <div>
      <div
        className={cn("h-full transition-[width]", {
          "w-56": !isCollapse,
          "w-0": isCollapse
        })}
      ></div>
      <div
        className={cn("fixed inset-y-0 z-[96] transition-all", {
          "-left-80 w-auto": isCollapse,
          "left-0 w-56": !isCollapse
        })}
      >
        <nav className="relative flex h-full shrink-0 flex-col transition-opacity">
          <LogoAndSearch />

          <div
            tabIndex={-1}
            className="relative mb-0.5 mt-1.5 flex grow flex-col overflow-y-auto rounded-md px-3.5"
          >
            <SidebarItem
              url="/inbox"
              label="Inbox"
              icon={<InboxIcon size={16} />}
            />

            <div className="h-2 shrink-0"></div>

            <Pages />
          </div>
          <div
            className="sc-hLtZSE kiTTnM sc-eCA-dml kRVpwE"
            style={{ right: "-5px", top: "14px", bottom: "14px" }}
          ></div>
        </nav>
      </div>
    </div>
  )
}

const LogoAndSearch = () => {
  return (
    <div className="px-3.5">
      <div className="mb-1 mt-2 flex h-10 max-w-full items-center">
        <div className="flex min-w-0">
          <Link href="/" className="px-2">
            <Logo className="size-7" />
          </Link>
        </div>

        <div className="flex min-w-2 grow flex-row"></div>

        <div className="flex flex-row items-center gap-2">
          <Link href="/search">
            <Button
              size="icon"
              variant="secondary"
              aria-label="Search"
              type="button"
              className="text-primary/60"
            >
              <SearchIcon size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Pages = () => {
  return (
    <div className="-ml-2">
      <div className="mb-0.5 ml-2 mt-2 flex cursor-pointer flex-row items-center justify-between rounded-md hover:bg-primary/10">
        <div
          role="button"
          tabIndex={0}
          className="flex h-6 grow items-center gap-x-0.5 self-start rounded-md px-1 text-xs font-medium text-primary/50"
        >
          <span>Pages</span>
          <ChevronDownIcon size={16} />
        </div>
      </div>

      <div className="relative shrink-0">
        <div aria-hidden="false" className="ml-2 shrink-0 pb-2">
          {PAGES.map((page) => (
            <SidebarItem key={page} url="/" label={page} />
          ))}
        </div>
      </div>
    </div>
  )
}

const SidebarItem = ({ label, url, icon }: SidebarItemProps) => {
  const pathname = usePathname()

  return (
    <div
      className={cn("group relative my-0.5 rounded-md", {
        "bg-secondary/80": pathname === url,
        "hover:bg-secondary/40": pathname !== url
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
              {
                "text-primary": pathname === url
              }
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
