"use client"

import { ListFilterIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ContentHeader } from "@/components/custom/content-header"
import { useMedia } from "react-use"

interface TabItemProps {
  url: string
  label: string
}

const TABS = ["All", "Learning", "To Learn", "Learned"]

export const LinkHeader = () => {
  const isTablet = useMedia("(max-width: 1024px)")

  return (
    <>
      <ContentHeader title="Link">
        {!isTablet && <Tabs />}
        <div className="flex flex-auto"></div>
        <FilterAndSort />
      </ContentHeader>

      {isTablet && (
        <div className="flex min-h-10 flex-row items-start justify-between border-b border-b-primary/5 px-6 py-2 max-lg:pl-4">
          <Tabs />
        </div>
      )}
    </>
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
