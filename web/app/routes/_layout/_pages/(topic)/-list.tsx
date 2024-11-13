import * as React from "react"
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual"
import {
  Link as LinkSchema,
  Section as SectionSchema,
  Topic,
} from "@/lib/schema"
import { LinkItem } from "./-item"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"

export type FlattenedItem =
  | { type: "link"; data: LinkSchema | null }
  | { type: "section"; data: SectionSchema | null }

interface TopicDetailListProps {
  items: FlattenedItem[]
  topic: Topic
  activeIndex: number
  setActiveIndex: (index: number) => void
}

export function TopicDetailList({
  items,
  topic,
  activeIndex,
  setActiveIndex,
}: TopicDetailListProps) {
  const { me } = useAccountOrGuest({ root: { personalLinks: [{}] } })
  const personalLinks =
    !me || me._type === "Anonymous" ? undefined : me.root.personalLinks

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  })

  const renderItem = React.useCallback(
    (virtualRow: VirtualItem) => {
      const item = items[virtualRow.index]

      if (item.type === "section") {
        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 px-6 py-2 max-lg:px-4">
              <p className="text-[13px] font-medium text-muted-foreground">
                {item.data?.title}
              </p>
              <div className="flex-1 border-b border-[var(--la-border-new)]" />
            </div>
          </div>
        )
      }

      if (item.data?.id) {
        return (
          <LinkItem
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            topic={topic}
            link={item.data as LinkSchema}
            isActive={activeIndex === virtualRow.index}
            index={virtualRow.index}
            setActiveIndex={setActiveIndex}
            personalLinks={personalLinks}
          />
        )
      }

      return null
    },
    [items, topic, activeIndex, setActiveIndex, virtualizer, personalLinks],
  )

  return (
    <div ref={parentRef} className="flex-1 overflow-auto py-4">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualizer.getVirtualItems()[0]?.start ?? 0}px)`,
          }}
        >
          {virtualizer.getVirtualItems().map(renderItem)}
        </div>
      </div>
    </div>
  )
}
