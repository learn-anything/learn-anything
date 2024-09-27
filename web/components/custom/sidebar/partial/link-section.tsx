import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import { LEARNING_STATES } from "@/lib/constants"

const ALL_STATES = [{ label: "All", value: "all", icon: "List", className: "text-foreground" }, ...LEARNING_STATES]
const ALL_STATES_STRING = ALL_STATES.map(ls => ls.value)

interface LinkSectionProps {
	pathname: string
}

export const LinkSection: React.FC<LinkSectionProps> = ({ pathname }) => {
	const { me } = useAccount({
		root: {
			personalLinks: []
		}
	})

	if (!me) return null

	const linkCount = me.root.personalLinks?.length || 0
	const isActive = pathname === "/links"

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<LinkSectionHeader linkCount={linkCount} isActive={isActive} />
			<List personalLinks={me.root.personalLinks} />
		</div>
	)
}

interface LinkSectionHeaderProps {
	linkCount: number
	isActive: boolean
}

const LinkSectionHeader: React.FC<LinkSectionHeaderProps> = ({ linkCount }) => {
	const pathname = usePathname()
	const [state] = useQueryState("state", parseAsStringLiteral(ALL_STATES_STRING))
	const isLinksActive = pathname.startsWith("/links") && (!state || state === "all")

	return (
		<div
			className={cn(
				"flex h-9 items-center gap-px rounded-md sm:h-[30px]",
				isLinksActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
			)}
		>
			<Link
				href="/links"
				className="flex flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
			>
				<p className="flex w-full items-center text-sm font-medium sm:text-xs">
					Links
					{linkCount > 0 && <span className="text-muted-foreground ml-1">{linkCount}</span>}
				</p>
			</Link>
		</div>
	)
}

interface ListProps {
	personalLinks: PersonalLinkLists
}

const List: React.FC<ListProps> = ({ personalLinks }) => {
	const pathname = usePathname()
	const [state] = useQueryState("state", parseAsStringLiteral(LEARNING_STATES.map(ls => ls.value)))

	const linkCounts = {
		wantToLearn: personalLinks.filter(link => link?.learningState === "wantToLearn").length,
		learning: personalLinks.filter(link => link?.learningState === "learning").length,
		learned: personalLinks.filter(link => link?.learningState === "learned").length
	}

	const isActive = (checkState: string) => pathname === "/links" && state === checkState

	return (
		<div className="flex flex-col gap-px">
			<ListItem
				label="To Learn"
				href="/links?state=wantToLearn"
				count={linkCounts.wantToLearn}
				isActive={isActive("wantToLearn")}
			/>
			<ListItem
				label="Learning"
				href="/links?state=learning"
				count={linkCounts.learning}
				isActive={isActive("learning")}
			/>
			<ListItem label="Learned" href="/links?state=learned" count={linkCounts.learned} isActive={isActive("learned")} />
		</div>
	)
}

interface ListItemProps {
	label: string
	href: string
	count: number
	isActive: boolean
}

const ListItem: React.FC<ListItemProps> = ({ label, href, count, isActive }) => (
	<div className="group/reorder-page relative">
		<div className="group/topic-link relative flex min-w-0 flex-1">
			<Link
				href={href}
				className={cn(
					"relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium sm:h-8",
					isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
				)}
			>
				<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
					<p className={cn("truncate opacity-95 group-hover/topic-link:opacity-100")}>{label}</p>
				</div>
			</Link>
			{count > 0 && (
				<span className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded p-1 text-sm">{count}</span>
			)}
		</div>
	</div>
)
