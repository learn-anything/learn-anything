import * as React from "react"
import { Link } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { LearningStateValue } from "~/lib/constants"

export const LinkSection: React.FC = () => {
  const { me } = useAccount({ root: { personalLinks: [] } })

  if (!me) return null

  const linkCount = me.root.personalLinks?.length || 0

  return (
    <div className="group/pages flex flex-col gap-px py-2">
      <LinkSectionHeader linkCount={linkCount} />
      <LinkList personalLinks={me.root.personalLinks} />
    </div>
  )
}

interface LinkSectionHeaderProps {
  linkCount: number
}

const LinkSectionHeader: React.FC<LinkSectionHeaderProps> = ({ linkCount }) => (
  <Link
    to="/links"
    className={cn(
      "flex h-9 items-center gap-px rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0 sm:h-[30px] sm:text-xs",
    )}
    activeProps={{
      className: "bg-accent text-accent-foreground",
    }}
  >
    Links
    {linkCount > 0 && (
      <span className="text-muted-foreground ml-1">{linkCount}</span>
    )}
  </Link>
)

interface LinkListProps {
  personalLinks: PersonalLinkLists
}

const LinkList: React.FC<LinkListProps> = ({ personalLinks }) => {
  const linkStates: LearningStateValue[] = [
    "wantToLearn",
    "learning",
    "learned",
  ]
  const linkLabels: Record<LearningStateValue, string> = {
    wantToLearn: "To Learn",
    learning: "Learning",
    learned: "Learned",
  }

  const linkCounts = linkStates.reduce(
    (acc, state) => ({
      ...acc,
      [state]: personalLinks.filter((link) => link?.learningState === state)
        .length,
    }),
    {} as Record<LearningStateValue, number>,
  )

  return (
    <div className="flex flex-col gap-px">
      {linkStates.map((state) => (
        <LinkListItem
          key={state}
          label={linkLabels[state]}
          state={state}
          count={linkCounts[state]}
        />
      ))}
    </div>
  )
}

interface LinkListItemProps {
  label: string
  state: LearningStateValue
  count: number
}

const LinkListItem: React.FC<LinkListItemProps> = ({ label, state, count }) => (
  <div className="group/reorder-page relative">
    <div className="group/topic-link relative flex min-w-0 flex-1">
      <Link
        to="/links"
        search={{ state }}
        className={cn(
          "relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium hover:bg-accent hover:text-accent-foreground sm:h-8",
        )}
        activeProps={{
          className: "bg-accent text-accent-foreground",
        }}
      >
        <div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
          <p className="truncate opacity-95 group-hover/topic-link:opacity-100">
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
