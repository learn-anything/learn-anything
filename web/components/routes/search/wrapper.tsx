"use client"
import { useState } from "react"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import AiSearch from "../../custom/ai-search"
import Link from "next/link"
import { Topic, PersonalLink, PersonalPage } from "@/lib/schema"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"

interface SearchTitleProps {
	title: string
	count: number
}
interface SearchItemProps {
	icon: string
	href: string
	title: string
	subtitle?: string
	topic?: Topic
}

const SearchTitle: React.FC<SearchTitleProps> = ({ title, count }) => (
	<div className="flex w-full items-center">
		<h2 className="text-md font-semibold">{title}</h2>
		<div className="mx-4 flex-grow">
			<div className="bg-result h-px"></div>
		</div>
		<span className="text-base font-light text-opacity-55">{count}</span>
	</div>
)

const SearchItem: React.FC<SearchItemProps> = ({ icon, href, title, subtitle, topic }) => (
	<div className="hover:bg-result group flex min-w-0 items-center gap-x-4 rounded-md p-2">
		<LaIcon
			name={icon as "Square"}
			className="size-4 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-50"
		/>
		<div className="group flex items-center justify-between">
			<Link
				href={href}
				passHref
				prefetch={false}
				onClick={e => e.stopPropagation()}
				className="hover:text-primary text-sm font-medium hover:opacity-70"
			>
				{title}
			</Link>
			{subtitle && (
				<Link
					href={href}
					passHref
					prefetch={false}
					onClick={e => e.stopPropagation()}
					className="text-muted-foreground ml-2 truncate text-xs hover:underline"
				>
					{subtitle}
				</Link>
			)}
			{topic && (
				<span className="ml-2 text-xs opacity-45">
					{topic.latestGlobalGuide?.sections?.reduce((total, section) => total + (section?.links?.length || 0), 0) || 0}{" "}
					links
				</span>
			)}
		</div>
	</div>
)

export const SearchWrapper = () => {
	const [searchText, setSearchText] = useState("")
	const [showAiSearch, setShowAiSearch] = useState(false)
	const [searchResults, setSearchResults] = useState<{
		topics: Topic[]
		links: PersonalLink[]
		pages: PersonalPage[]
	}>({ topics: [], links: [], pages: [] })

	const { me } = useAccount({
		root: { personalLinks: [], personalPages: [] }
	})

	const globalGroup = useCoState(PublicGlobalGroup, JAZZ_GLOBAL_GROUP_ID, {
		root: {
			topics: []
		}
	})

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toLowerCase()
		setSearchText(value)

		if (!value) {
			setSearchResults({ topics: [], links: [], pages: [] })
			return
		}
		setSearchResults({
			topics:
				globalGroup?.root.topics?.filter(
					(topic: Topic | null): topic is Topic => topic !== null && topic.prettyName.toLowerCase().startsWith(value)
				) || [],
			links:
				me?.root.personalLinks?.filter(
					(link: PersonalLink | null): link is PersonalLink =>
						link !== null && link.title.toLowerCase().startsWith(value)
				) || [],
			pages:
				me?.root.personalPages?.filter(
					(page): page is PersonalPage =>
						page !== null && page.title !== undefined && page.title.toLowerCase().startsWith(value)
				) || []
		})
	}

	const clearSearch = () => {
		setSearchText("")
		setSearchResults({ topics: [], links: [], pages: [] })
		setShowAiSearch(false)
	}

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<div className="flex h-full w-full justify-center overflow-y-auto">
				<div className="w-full max-w-[70%] sm:px-6 lg:px-8">
					<div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300">
						<div className="relative my-5 flex w-full items-center space-x-2">
							<LaIcon name="Search" className="text-foreground absolute left-4 size-4 flex-shrink-0" />
							<input
								autoFocus
								type="text"
								value={searchText}
								onChange={handleSearch}
								placeholder="Search topics, links, pages"
								className="dark:bg-input w-full rounded-lg border border-neutral-300 p-2 pl-8 focus:outline-none dark:border-neutral-600"
							/>
							{searchText && (
								<LaIcon
									name="X"
									className="text-foreground/50 absolute right-3 size-4 flex-shrink-0 cursor-pointer"
									onClick={clearSearch}
								/>
							)}
						</div>
					</div>
					<div className="relative w-full pb-5">
						{Object.values(searchResults).some(arr => arr.length > 0) ? (
							<div className="space-y-1">
								{searchResults.links.length > 0 && (
									<>
										<SearchTitle title="Links" count={searchResults.links.length} />
										{searchResults.links.map(link => (
											<SearchItem key={link.id} icon="Square" href={link.url} title={link.title} subtitle={link.url} />
										))}
									</>
								)}
								{searchResults.pages.length > 0 && (
									<>
										<SearchTitle title="Pages" count={searchResults.pages.length} />
										{searchResults.pages.map(page => (
											<SearchItem key={page.id} icon="Square" href={`/pages/${page.id}`} title={page.title || ""} />
										))}
									</>
								)}
								{searchResults.topics.length > 0 && (
									<>
										<SearchTitle title="Topics" count={searchResults.topics.length} />
										{searchResults.topics.map(topic => (
											<SearchItem
												key={topic.id}
												icon="Square"
												href={`/${topic.name}`}
												title={topic.prettyName}
												topic={topic}
											/>
										))}
									</>
								)}
							</div>
						) : (
							<div className="mt-5">
								{/* {searchText && !showAiSearch && ( */}
								{searchText && (
									<div
										className="cursor-default rounded-lg bg-blue-700 p-4 font-semibold text-white"
										// onClick={() => setShowAiSearch(true)}
									>
										✨ Didn&apos;t find what you were looking for? Will soon have AI assistant builtin
									</div>
								)}
								{showAiSearch && <AiSearch searchQuery={searchText} />}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
