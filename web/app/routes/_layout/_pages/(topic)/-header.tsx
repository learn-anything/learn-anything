import * as React from "react"
import {
  ContentHeader,
  SidebarToggleButton,
} from "@/components/custom/content-header"
import { ListOfTopics, Topic } from "@/lib/schema"
import { LearningStateSelector } from "@/components/custom/learning-state-selector"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { LearningStateValue } from "@/lib/constants"
import { useMedia } from "@/hooks/use-media"
import { useClerk } from "@clerk/tanstack-start"
import { useLocation } from "@tanstack/react-router"
import { Input } from "~/components/ui/input"
import { LaIcon } from "~/components/custom/la-icon"

interface TopicDetailHeaderProps {
  topic: Topic
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const TopicDetailHeader = function TopicDetailHeader({
  topic,
  searchQuery,
  setSearchQuery,
}: TopicDetailHeaderProps) {
  const clerk = useClerk()
  const { pathname } = useLocation()
  const isMobile = useMedia("(max-width: 770px)")
  const { me } = useAccountOrGuest({
    root: {
      topicsWantToLearn: [{}],
      topicsLearning: [{}],
      topicsLearned: [{}],
    },
  })

  let p: {
    index: number
    topic?: Topic | null
    learningState: LearningStateValue
  } | null = null

  const wantToLearnIndex =
    me?._type === "Anonymous"
      ? -1
      : (me?.root.topicsWantToLearn.findIndex((t) => t?.id === topic.id) ?? -1)
  if (wantToLearnIndex !== -1) {
    p = {
      index: wantToLearnIndex,
      topic:
        me && me._type !== "Anonymous"
          ? me.root.topicsWantToLearn[wantToLearnIndex]
          : undefined,
      learningState: "wantToLearn",
    }
  }

  const learningIndex =
    me?._type === "Anonymous"
      ? -1
      : (me?.root.topicsLearning.findIndex((t) => t?.id === topic.id) ?? -1)
  if (learningIndex !== -1) {
    p = {
      index: learningIndex,
      topic:
        me && me._type !== "Anonymous"
          ? me?.root.topicsLearning[learningIndex]
          : undefined,
      learningState: "learning",
    }
  }

  const learnedIndex =
    me?._type === "Anonymous"
      ? -1
      : (me?.root.topicsLearned.findIndex((t) => t?.id === topic.id) ?? -1)
  if (learnedIndex !== -1) {
    p = {
      index: learnedIndex,
      topic:
        me && me._type !== "Anonymous"
          ? me?.root.topicsLearned[learnedIndex]
          : undefined,
      learningState: "learned",
    }
  }

  const handleAddToProfile = (learningState: LearningStateValue) => {
    if (me?._type === "Anonymous") {
      return clerk.redirectToSignIn({
        signInFallbackRedirectUrl: pathname,
      })
    }

    const topicLists: Record<
      LearningStateValue,
      (ListOfTopics | null) | undefined
    > = {
      wantToLearn: me?.root.topicsWantToLearn,
      learning: me?.root.topicsLearning,
      learned: me?.root.topicsLearned,
    }

    const removeFromList = (state: LearningStateValue, index: number) => {
      topicLists[state]?.splice(index, 1)
    }

    if (p) {
      if (learningState === p.learningState) {
        removeFromList(p.learningState, p.index)
        return
      }
      removeFromList(p.learningState, p.index)
    }

    topicLists[learningState]?.push(topic)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <>
      <ContentHeader>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <SidebarToggleButton />
          <div className="flex min-h-0 min-w-0 flex-1 items-center">
            <h1 className="truncate text-left font-semibold lg:text-lg">
              {topic.prettyName}
            </h1>
          </div>
        </div>

        <div className="flex flex-auto"></div>
        {/* <GuideCommunityToggle topicName={topic.name} /> */}

        <LearningStateSelector
          showSearch={false}
          value={p?.learningState || ""}
          onChange={handleAddToProfile}
          defaultLabel={isMobile ? "" : "Add to profile"}
          defaultIcon="Circle"
        />
      </ContentHeader>
      <div className="flex min-h-10 flex-row items-center justify-between border-b border-b-[var(--la-border-new)] px-6 py-2 max-lg:px-4">
        <div className="flex flex-1 flex-row items-center gap-2">
          <span className="text-tertiary flex h-5 w-5 items-center justify-center">
            <LaIcon name="Search" className="text-muted-foreground" />
          </span>
          <Input
            className="h-6 flex-1 border-none bg-transparent p-0 focus-visible:ring-0"
            placeholder="Search..."
            role="searchbox"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </>
  )
}

TopicDetailHeader.displayName = "TopicDetailHeader"
