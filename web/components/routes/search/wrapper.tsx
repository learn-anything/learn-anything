"use client"
import { useState } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import AiSearch from "../../custom/ai-search"
import { Topic } from "@/lib/schema"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import Link from "next/link"

interface SearchTitleProps {
	topics: string[]
	topicTitle: string
}

const SearchTitle: React.FC<SearchTitleProps> = ({ topicTitle, topics }) => {
	return (
		<div className="flex w-full items-center">
			<h2 className="text-lg font-semibold">{topicTitle}</h2>
			<div className="mx-4 flex-grow">
				<div className="h-px bg-neutral-200 dark:bg-neutral-700"></div>
			</div>
			<span className="text-base font-light text-opacity-55">{topics.length}</span>
		</div>
	)
}

export const SearchWrapper = () => {
	const [searchText, setSearchText] = useState("")
	const [showAiSearch, setShowAiSearch] = useState(false)
	const [searchResults, setSearchResults] = useState<Topic[]>([])

	const globalGroup = useCoState(
		PublicGlobalGroup,
		process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>,
		{
			root: {
				topics: []
			}
		}
	)
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchText(value)

		const results = value
			? globalGroup?.root.topics.filter(
					(topic): topic is Topic => topic !== null && topic.prettyName.toLowerCase().startsWith(value.toLowerCase())
				)
			: []
		setSearchResults(results)
	}

	const clearSearch = () => {
		setSearchText("")
		setSearchResults([])
	}

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<div className="flex h-full w-full justify-center overflow-y-auto">
				<div className="w-full max-w-[70%] sm:px-6 lg:px-8">
					<div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300">
						<div className="relative my-5 flex w-full items-center space-x-2">
							<LaIcon name="Search" className="absolute left-4 size-4 flex-shrink-0 text-black/50 dark:text-white/50" />
							<input
								autoFocus
								type="text"
								value={searchText}
								onChange={handleSearch}
								placeholder="Search something..."
								className="dark:bg-input w-full rounded-lg border border-neutral-300 p-2 pl-8 focus:outline-none dark:border-neutral-600"
							/>

							{searchText && (
								<LaIcon
									name="X"
									className="absolute right-3 size-4 flex-shrink-0 cursor-pointer text-black/50 dark:text-white/50"
									onClick={clearSearch}
								/>
							)}
						</div>
					</div>
					<div className="relative w-full pb-5">
						{searchResults.length > 0 ? (
							<div className="space-y-4">
								<SearchTitle topicTitle="Topics" topics={searchResults.map(topic => topic.prettyName)} />
								{searchResults.map((topic, index) => (
									<div key={topic.id} className="group flex min-w-0 items-center gap-x-4">
										<LaIcon
											name="Square"
											className="size-4 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-50"
										/>
										<div className="group">
											<Link
												href={`/${topic.name}`}
												passHref
												prefetch={false}
												onClick={e => e.stopPropagation()}
												className="hover:text-primary text-sm font-medium hover:opacity-70"
											>
												{topic.prettyName}
												<span className="ml-2 text-xs opacity-45">
													{topic.latestGlobalGuide?.sections?.reduce(
														(total, section) => total + (section?.links?.length || 0),
														0
													) || 0}{" "}
													links
												</span>
											</Link>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="mt-5">
								{searchText && searchResults.length === 0 && !showAiSearch && (
									<div
										className="cursor-pointer rounded-lg bg-blue-700 p-4 font-semibold text-white"
										onClick={() => setShowAiSearch(true)}
									>
										✨ Didn't find what you were looking for? Ask AI
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
