import * as React from "react"
import { Link } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { LearningStateValue } from "~/lib/constants"
import { LaIcon } from "~/components/custom/la-icon"

export const LinkSection: React.FC = () => {
  const { me } = useAccount({ root: { personalLinks: [] } })

  if (!me) return null

  const linkCount = me.root.personalLinks?.length || 0

  return (
    <div className="flex flex-col gap-px py-2">
      <LinkSectionHeader linkCount={linkCount} />
      <LinkList personalLinks={me.root.personalLinks} />
    </div>
  )
}

interface LinkSectionHeaderProps {
  linkCount: number
}

const LinkSectionHeader: React.FC<LinkSectionHeaderProps> = ({ linkCount }) => {
  return (
    <Link
      to="/links"
      className={cn(
        "flex h-[30px] items-center gap-px rounded-md px-2 text-sm font-medium hover:bg-[var(--item-hover)] focus-visible:outline-none focus-visible:ring-0",
      )}
      activeProps={{
        className:
          "bg-[var(--item-active)] data-[status='active']:hover:bg-[var(--item-active)]",
      }}
    >
      {({ isActive }) => {
        return (
          <>
            <div className="flex items-center gap-1.5">
              <LaIcon name="Link" className="" />
              <span>Links</span>
            </div>
            <span className="flex flex-auto"></span>
            {linkCount > 0 && (
              <span
                className={cn("font-mono text-muted-foreground", {
                  "text-foreground": isActive,
                })}
              >
                {linkCount}
              </span>
            )}
          </>
        )
      }}
    </Link>
  )
}

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
  <div className="relative flex min-w-0 flex-1">
    <Link
      to="/links"
      search={{ state }}
      className={cn(
        "relative flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-sm font-medium hover:bg-[var(--item-hover)]",
      )}
      activeProps={{
        className:
          "bg-[var(--item-active)] data-[status='active']:hover:bg-[var(--item-active)]",
      }}
    >
      {({ isActive }) => (
        <>
          <div className="flex max-w-full flex-1 items-center gap-1.5 truncate">
            <p className="truncate">{label}</p>
          </div>
          {count > 0 && (
            <span
              className={cn("font-mono text-muted-foreground", {
                "text-foreground": isActive,
              })}
            >
              {count}
            </span>
          )}
        </>
      )}
    </Link>
  </div>
)
