import * as React from "react"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useAccountOrGuest, useCoState } from "@/lib/providers/jazz-provider"
import { GraphData, JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { Topic } from "@/lib/schema"
import { atom } from "jotai"
import { Skeleton } from "@/components/ui/skeleton"
import { LaIcon } from "@/components/custom/la-icon"
import { TopicDetailHeader } from "./-header"
import { TopicDetailList } from "./-list"

export const Route = createFileRoute("/_layout/_pages/(topic)/$")({
  component: TopicDetailComponent,
})

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailComponent() {
  const params = useParams({ from: "/_layout/_pages/(topic)/$" })
  const { me } = useAccountOrGuest({ root: { personalLinks: [{}] } })

  const topicID = React.useMemo(
    () =>
      me &&
      Topic.findUnique({ topicName: params._splat }, JAZZ_GLOBAL_GROUP_ID, me),
    [params._splat, me],
  )
  const topic = useCoState(Topic, topicID, {
    latestGlobalGuide: { sections: [] },
  })
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [searchQuery, setSearchQuery] = React.useState("")

  const topicExists = React.useMemo(
    () => GraphData.find((node) => node.name === params._splat),
    [params._splat],
  )

  const latestGlobalGuide = React.useMemo(
    () => topic?.latestGlobalGuide,
    [topic?.latestGlobalGuide],
  )

  const flattenedItems = React.useMemo(
    () =>
      latestGlobalGuide?.sections.flatMap((section) => [
        { type: "section" as const, data: section },
        ...(section?.links?.map((link) => ({
          type: "link" as const,
          data: link,
        })) || []),
      ]) || [],
    [latestGlobalGuide],
  )

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return flattenedItems
    return flattenedItems.filter((item) => {
      if (item.type === "section") {
        return item.data?.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      }
      if (item.type === "link") {
        return (
          item.data?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.data?.url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return false
    })
  }, [flattenedItems, searchQuery])

  if (!topicExists) {
    return <NotFoundPlaceholder />
  }

  if (!topic || !me) {
    return <TopicDetailSkeleton />
  }

  return (
    <>
      <TopicDetailHeader
        topic={topic}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TopicDetailList
        items={filteredItems}
        topic={topic}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  )
}

function NotFoundPlaceholder() {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-3">
      <div className="flex flex-row items-center gap-1.5">
        <LaIcon name="CircleAlert" />
        <span className="text-left font-medium">Topic not found</span>
      </div>
      <span className="max-w-sm text-left text-sm">
        There is no topic with the given identifier.
      </span>
    </div>
  )
}

function TopicDetailSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 max-lg:px-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-7 w-28" />
      </div>

      <div className="space-y-4 p-6 max-lg:px-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
