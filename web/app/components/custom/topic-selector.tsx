import * as React from "react"
import { atom, useAtom } from "jotai"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ListOfTopics, Topic } from "@/lib/schema"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { VariantProps } from "class-variance-authority"

interface TopicSelectorProps extends VariantProps<typeof buttonVariants> {
  showSearch?: boolean
  defaultLabel?: string
  searchPlaceholder?: string
  value?: string | null
  onChange?: (value: string) => void
  onTopicChange?: (value: Topic) => void
  className?: string
  renderSelectedText?: (value?: string | null) => React.ReactNode
  side?: "bottom" | "top" | "right" | "left"
  align?: "center" | "end" | "start"
}

export const topicSelectorAtom = atom(false)

export const TopicSelector = React.forwardRef<
  HTMLButtonElement,
  TopicSelectorProps
>(
  (
    {
      showSearch = true,
      defaultLabel = "Select topic",
      searchPlaceholder = "Search topic...",
      value,
      onChange,
      onTopicChange,
      className,
      renderSelectedText,
      side = "bottom",
      align = "end",
      ...props
    },
    ref,
  ) => {
    const [isTopicSelectorOpen, setIsTopicSelectorOpen] =
      useAtom(topicSelectorAtom)
    const group = useCoState(PublicGlobalGroup, JAZZ_GLOBAL_GROUP_ID, {
      root: { topics: [] },
    })

    const handleSelect = React.useCallback(
      (selectedTopicName: string, topic: Topic) => {
        onChange?.(selectedTopicName)
        onTopicChange?.(topic)
        setIsTopicSelectorOpen(false)
      },
      [onChange, setIsTopicSelectorOpen, onTopicChange],
    )

    const displaySelectedText = React.useMemo(() => {
      if (renderSelectedText) {
        return renderSelectedText(value)
      }
      return <span className="truncate">{value || defaultLabel}</span>
    }, [value, defaultLabel, renderSelectedText])

    return (
      <Popover open={isTopicSelectorOpen} onOpenChange={setIsTopicSelectorOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            size="sm"
            type="button"
            role="combobox"
            variant="secondary"
            className={cn("gap-x-2 text-sm", className)}
            {...props}
          >
            {displaySelectedText}
            <LaIcon name="ChevronDown" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-52 rounded-lg p-0"
          side={side}
          align={align}
        >
          {group?.root.topics && (
            <TopicSelectorContent
              showSearch={showSearch}
              searchPlaceholder={searchPlaceholder}
              value={value}
              onSelect={handleSelect}
              topics={group.root.topics}
            />
          )}
        </PopoverContent>
      </Popover>
    )
  },
)

TopicSelector.displayName = "TopicSelector"

interface TopicSelectorContentProps
  extends Omit<TopicSelectorProps, "onChange" | "onTopicChange"> {
  onSelect: (value: string, topic: Topic) => void
  topics: ListOfTopics
}

const TopicSelectorContent: React.FC<TopicSelectorContentProps> = ({
  showSearch,
  searchPlaceholder,
  value,
  onSelect,
  topics,
}) => {
  const [search, setSearch] = React.useState("")
  const filteredTopics = React.useMemo(
    () =>
      topics.filter((topic) =>
        topic?.prettyName.toLowerCase().includes(search.toLowerCase()),
      ),
    [topics, search],
  )

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: filteredTopics.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  return (
    <Command>
      {showSearch && (
        <CommandInput
          placeholder={searchPlaceholder}
          className="h-9"
          value={search}
          onValueChange={setSearch}
        />
      )}
      <CommandList>
        <div ref={parentRef} style={{ height: "200px", overflow: "auto" }}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <CommandGroup>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const topic = filteredTopics[virtualRow.index]
                return (
                  topic && (
                    <CommandItem
                      key={virtualRow.key}
                      value={topic.name}
                      onSelect={(value) => onSelect(value, topic)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <span>{topic.prettyName}</span>
                      <LaIcon
                        name="Check"
                        className={cn(
                          "absolute right-3",
                          topic.name === value
                            ? "text-primary"
                            : "text-transparent",
                        )}
                      />
                    </CommandItem>
                  )
                )
              })}
            </CommandGroup>
          </div>
        </div>
      </CommandList>
    </Command>
  )
}

TopicSelectorContent.displayName = "TopicSelectorContent"

export default TopicSelector
