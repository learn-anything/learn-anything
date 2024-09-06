import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { PersonalLinkLists } from "@/lib/schema/personal-link"

export const LinkSection: React.FC = () => {
	const { me } = useAccount({
		root: {
			personalLinks: []
		}
	})

	const linkCount = me?.root.personalLinks?.length || 0

	if (!me) return null

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<LinkSectionHeader linkCount={linkCount} />
			<List personalLinks={me.root.personalLinks} />
		</div>
	)
}

interface LinkSectionHeaderProps {
	linkCount: number
}

const LinkSectionHeader: React.FC<LinkSectionHeaderProps> = ({ linkCount }) => (
	<div
		className={cn("flex min-h-[30px] items-center gap-px rounded-md", "hover:bg-accent hover:text-accent-foreground")}
	>
		<Link
			href="/"
			className={cn(
				"size-6 flex-1 items-center justify-start rounded-md px-2 py-1",
				"focus-visible:outline-none focus-visible:ring-0",
				"hover:bg-accent hover:text-accent-foreground"
			)}
		>
			<p className="flex items-center text-xs font-medium">
				Links
				{linkCount > 0 && <span className="text-muted-foreground ml-1">{linkCount}</span>}
			</p>
		</Link>
	</div>
)

interface ListProps {
	personalLinks: PersonalLinkLists
}

const List: React.FC<ListProps> = ({ personalLinks }) => {
	const pathname = usePathname()

	return (
		<div className="flex flex-col gap-px">
			<ListItem label="All Links" href="/links" count={personalLinks.length} isActive={pathname === "/links"} />
		</div>
	)
}

interface ListItemProps {
	label: string
	href: string
	count: number
	isActive: boolean
}

const ListItem: React.FC<ListItemProps> = ({ label, href, count, isActive }) => {
	return (
		<div className="group/reorder-page relative">
			<div className="group/topic-link relative flex min-w-0 flex-1">
				<Link
					href={href}
					className={cn(
						"group-hover/topic-link:bg-accent relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
						{ "bg-accent text-accent-foreground": isActive }
					)}
				>
					<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
						<LaIcon name="Link" className="flex-shrink-0 opacity-60" />
						<p className={cn("truncate opacity-95 group-hover/topic-link:opacity-100")}>{label}</p>
					</div>
				</Link>

				{count > 0 && (
					<span className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded p-1 text-sm">{count}</span>
				)}
			</div>
		</div>
	)
}
