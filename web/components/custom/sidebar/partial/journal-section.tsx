import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "../../la-icon"
import { cn } from "@/lib/utils"

export const JournalSection: React.FC = () => {
	const { me } = useAccount()
	const journalEntries = me?.root?.journalEntries
	const pathname = usePathname()
	const isActive = pathname === "/journal"

	return (
		<div className="group/journal flex flex-col gap-px py-2">
			<JournalSectionHeader entriesCount={journalEntries?.length || 0} isActive={isActive} />
			{journalEntries && journalEntries.length > 0 && <JournalEntryList entries={journalEntries} />}
		</div>
	)
}

interface JournalHeaderProps {
	entriesCount: number
	isActive: boolean
}

const JournalSectionHeader: React.FC<JournalHeaderProps> = ({ entriesCount, isActive }) => (
	<div
		className={cn(
			"flex min-h-[30px] items-center gap-px rounded-md",
			isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
		)}
	>
		<Link
			href="/journal"
			className="flex flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			<p className="text-xs">
				Journal
				{entriesCount > 0 && <span className="text-muted-foreground ml-1">({entriesCount})</span>}
			</p>
		</Link>
	</div>
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
	<Link href={`/journal/${entry.id}`} className="group/journal-entry relative flex min-w-0 flex-1">
		<div className="relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium">
			<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
				<LaIcon name="FileText" className="opacity-60" />
				<p className={cn("truncate opacity-95 group-hover/journal-entry:opacity-100")}>{entry.title}</p>
			</div>
		</div>
	</Link>
)
