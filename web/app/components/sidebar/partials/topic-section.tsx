import * as React from "react"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { ListOfTopics } from "@/lib/schema"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { Link } from "@tanstack/react-router"

export const TopicSection: React.FC = () => {
  const { me } = useAccount({
    root: {
      topicsWantToLearn: [],
      topicsLearning: [],
      topicsLearned: [],
    },
  })

  const topicCount =
    (me?.root.topicsWantToLearn?.length || 0) +
    (me?.root.topicsLearning?.length || 0) +
    (me?.root.topicsLearned?.length || 0)

  if (!me) return null

  return (
    <div className="group/topics flex flex-col gap-px py-2">
      <TopicSectionHeader topicCount={topicCount} />
      <List
        topicsWantToLearn={me.root.topicsWantToLearn}
        topicsLearning={me.root.topicsLearning}
        topicsLearned={me.root.topicsLearned}
      />
    </div>
  )
}

interface TopicSectionHeaderProps {
  topicCount: number
}

const TopicSectionHeader: React.FC<TopicSectionHeaderProps> = ({
  topicCount,
}) => (
  <Link
    to="/topics"
    className="flex h-9 items-center gap-px rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0 sm:h-[30px] sm:text-xs"
    activeProps={{
      className: "bg-accent text-accent-foreground",
    }}
  >
    <p className="text-sm sm:text-xs">
      Topics
      {topicCount > 0 && (
        <span className="text-muted-foreground ml-1">{topicCount}</span>
      )}
    </p>
  </Link>
)

interface ListProps {
  topicsWantToLearn: ListOfTopics
  topicsLearning: ListOfTopics
  topicsLearned: ListOfTopics
}

const List: React.FC<ListProps> = ({
  topicsWantToLearn,
  topicsLearning,
  topicsLearned,
}) => {
  return (
    <div className="flex flex-col gap-px">
      <ListItem
        key={topicsWantToLearn.id}
        count={topicsWantToLearn.length}
        label="To Learn"
        value="wantToLearn"
      />
      <ListItem
        key={topicsLearning.id}
        label="Learning"
        value="learning"
        count={topicsLearning.length}
      />
      <ListItem
        key={topicsLearned.id}
        label="Learned"
        value="learned"
        count={topicsLearned.length}
      />
    </div>
  )
}

interface ListItemProps {
  label: string
  value: LearningStateValue
  count: number
}

const ListItem: React.FC<ListItemProps> = ({ label, value, count }) => {
  const le = LEARNING_STATES.find((l) => l.value === value)

  if (!le) return null

  return (
    <div className="group/reorder-page relative">
      <div className="group/topic-link relative flex min-w-0 flex-1">
        <Link
          to="/topics"
          search={{ learningState: value }}
          className={cn(
            "group-hover/topic-link:bg-accent relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium sm:h-8",
            le.className,
          )}
          activeOptions={{ exact: true }}
          activeProps={{
            className: "bg-accent text-accent-foreground",
          }}
        >
          <div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
            <LaIcon name={le.icon} className="flex-shrink-0 opacity-60" />
            <p
              className={cn(
                "truncate opacity-95 group-hover/topic-link:opacity-100",
                le.className,
              )}
            >
              {label}
            </p>
          </div>
        </Link>

        {count > 0 && (
          <span className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded p-1 text-sm">
            {count}
          </span>
        )}
      </div>
    </div>
  )
}
