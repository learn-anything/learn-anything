"use client"
import { useState } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import AiSearch from "../../custom/ai-search"
import { Topic } from "@/lib/schema"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"

interface ProfileTopicsProps {
	topic: string
}

const ProfileTopics: React.FC<ProfileTopicsProps> = ({ topic }) => {
	return (
		<div className="bg-result flex cursor-pointer flex-row items-center justify-between rounded-lg p-3">
			<p>{topic}</p>
			<LaIcon
				name="ChevronRight"
				className="size-4 flex-shrink-0 cursor-pointer text-black/50 dark:text-white/50"
				size={20}
			/>
		</div>
	)
}

interface ProfileTitleProps {
	topics: string[]
	topicTitle: string
}

const ProfileTitle: React.FC<ProfileTitleProps> = ({ topicTitle, topics }) => {
	return (
		<p className="pb-3 pl-2 text-base font-light text-black/50 dark:text-white/50">
			{topicTitle} <span className="text-black dark:text-white">{topics.length}</span>
		</p>
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

		// Filter topics based on the search text
		const results = value
			? globalGroup?.root.topics.filter(
					(topic): topic is Topic => topic !== null && topic.prettyName.toLowerCase().includes(value.toLowerCase())
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
			<div className="flex h-full w-full justify-center overflow-hidden">
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
								className="dark:bg-input w-full rounded-lg border border-gray-300 p-2 pl-8 focus:outline-none dark:border-neutral-600"
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
					<div className="relative w-full">
						{searchResults.length > 0 ? (
							<div className="space-y-1">
								<ProfileTitle topicTitle="Topics" topics={searchResults.map(topic => topic.prettyName)} />
								{searchResults.map((topic, index) => (
									<ProfileTopics key={topic.id} topic={topic.prettyName} />
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
