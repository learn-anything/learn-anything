"use client"

import { useAtom } from "jotai"
import { isCollapseAtom, toggleCollapseAtom } from "@/store/sidebar"
import { ListFilterIcon, PanelLeftIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

interface TabItemProps {
  url: string
  label: string
}

const TABS = ["All", "Links", "Todos", "Topics"]

export const InboxContentHeader = () => {
  return (
    <header className="flex min-h-10 min-w-0 shrink-0 items-center gap-3 border-b border-b-primary/5 py-1 pl-8 pr-6 transition-opacity max-lg:pl-4 max-lg:pr-5">
      <TitleAndActions />
      <Tabs />
      <div className="flex flex-auto"></div>
      <FilterAndSort />
    </header>
  )
}

const TitleAndActions = () => {
  const [isCollapse] = useAtom(isCollapseAtom)
  const [, toogle] = useAtom(toggleCollapseAtom)

  return (
    <div
      className="flex min-h-10 min-w-0 shrink-0 items-center gap-1.5"
      style={{ maxWidth: "50%" }}
    >
      {isCollapse && (
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

      <div className="truncate text-sm font-medium">Inbox</div>
    </div>
  )
}

const Tabs = () => {
  return (
    <div className="flex items-baseline gap-2 overflow-x-hidden rounded-md bg-secondary/50">
      {TABS.map((tab) => (
        <TabItem key={tab} url="#" label={tab} />
      ))}
    </div>
  )
}

const TabItem = ({ url, label }: TabItemProps) => {
  return (
    <div tabIndex={-1} className="rounded-md">
      <div className="flex flex-row">
        <div aria-label={label}>
          <Link href={url}>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              className="gap-x-2 truncate text-sm"
            >
              {label}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const FilterAndSort = () => {
  return (
    <div className="flex w-auto items-center justify-end">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          type="button"
          variant="secondary"
          className="gap-x-2 text-sm"
        >
          <ListFilterIcon size={16} className="text-primary/60" />
          <span className="hidden md:block">Filter</span>
        </Button>
        <Button
          size="sm"
          type="button"
          variant="secondary"
          className="gap-x-2 text-sm"
        >
          <PlusIcon size={16} className="text-primary/60" />
          <span className="hidden md:block">Date added</span>
        </Button>
      </div>
    </div>
  )
}
