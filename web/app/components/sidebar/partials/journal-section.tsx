import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/tanstack-start"
import { LaIcon } from "~/components/custom/la-icon"
import { Link } from "@tanstack/react-router"
import { getFeatureFlag } from "~/actions"

export const JournalSection: React.FC = () => {
  const { me } = useAccount({ root: { journalEntries: [{}] } })
  const journalEntries = me?.root.journalEntries

  const [, setIsFetching] = useState(false)
  const [isFeatureActive, setIsFeatureActive] = useState(false)
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    async function checkFeatureFlag() {
      setIsFetching(true)

      if (isLoaded && isSignedIn) {
        const response = await getFeatureFlag({ data: "JOURNAL" })

        if (
          user?.emailAddresses.some((email) =>
            response?.emails?.includes(email.emailAddress),
          )
        ) {
          setIsFeatureActive(true)
        }
        setIsFetching(false)
      }
    }

    checkFeatureFlag()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || !isSignedIn) {
    return <div className="py-2 text-center text-gray-500">Loading...</div>
  }

  if (!me) return null

  if (!isFeatureActive) {
    return null
  }

  return (
    <div className="group/journal flex flex-col gap-px py-2">
      <JournalSectionHeader entriesCount={journalEntries?.length || 0} />
      {journalEntries && journalEntries.length > 0 && (
        <JournalEntryList entries={journalEntries} />
      )}
    </div>
  )
}

interface JournalHeaderProps {
  entriesCount: number
}

const JournalSectionHeader: React.FC<JournalHeaderProps> = ({
  entriesCount,
}) => (
  <Link
    to="/journals"
    className={cn(
      "flex h-9 items-center gap-px rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0 sm:h-[30px] sm:text-xs",
    )}
    activeProps={{
      className: "bg-accent text-accent-foreground",
    }}
  >
    <p className="text-xs">
      Journal
      {entriesCount > 0 && (
        <span className="ml-1 text-muted-foreground">({entriesCount})</span>
      )}
    </p>
  </Link>
)

interface JournalEntryListProps {
  entries: any[]
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ entries }) => {
  return (
    <div className="flex flex-col gap-px">
      {entries.map((entry, index) => (
        <JournalEntryItem key={index} entry={entry} />
      ))}
    </div>
  )
}

interface JournalEntryItemProps {
  entry: any
}

const JournalEntryItem: React.FC<JournalEntryItemProps> = ({ entry }) => (
  <Link
    href={`/journal/${entry.id}`}
    className="group/journal-entry relative flex min-w-0 flex-1"
  >
    <div className="relative flex h-[30px] w-full items-center gap-2 rounded-md p-1.5 font-medium">
      <div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
        <LaIcon name="FileText" className="opacity-60" />
        <p
          className={cn(
            "truncate opacity-95 group-hover/journal-entry:opacity-100",
          )}
        >
          {entry.title}
        </p>
      </div>
    </div>
  </Link>
)
