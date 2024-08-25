"use client"
import { useState } from "react"
// import { useAccount } from "@/lib/providers/jazz-provider"
import { IoSearch, IoCloseOutline, IoChevronForward } from "react-icons/io5"
import AiSearch from "../../custom/ai-search"

interface ProfileTopicsProps {
	topic: string
}

const ProfileTopics: React.FC<ProfileTopicsProps> = ({ topic }) => {
	return (
		<div className="bg-result flex cursor-pointer flex-row items-center justify-between rounded-lg p-3">
			<p>{topic}</p>
			<IoChevronForward className="text-black/50 dark:text-white" size={20} />
		</div>
	)
}

interface ProfileLinksProps {
	linklabel: string
	link: string
	topic: string
}

interface ProfileTitleProps {
	topicTitle: string
	spanNumber: number
}

const ProfileTitle: React.FC<ProfileTitleProps> = ({ topicTitle, spanNumber }) => {
	return (
		<p className="pb-3 pl-2 text-base font-light text-black/50 dark:text-white/50">
			{topicTitle} <span className="text-black dark:text-white">{spanNumber}</span>
		</p>
	)
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ linklabel, link, topic }) => {
	return (
		<div className="bg-result flex flex-row items-center justify-between rounded-lg p-3 text-black dark:text-white">
			<div className="flex flex-row items-center space-x-3">
				<p className="text-base">{linklabel}</p>
				<div className="flex cursor-pointer flex-row items-center gap-1">
					<p className="text-md opacity-50 transition-colors duration-300 hover:opacity-30">{link}</p>
				</div>
			</div>
			<div className="cursor-default rounded-lg bg-[#888888] p-2 text-white dark:bg-[#1a1a1a] dark:text-opacity-50">
				{topic}
			</div>
		</div>
	)
}

export const SearchWrapper = () => {
	// const account = useAccount()
	const [searchText, setSearchText] = useState("")
	const [aiSearch, setAiSearch] = useState("")
	const [showAiSearch, setShowAiSearch] = useState(false)
	const [showAiPlaceholder, setShowAiPlaceholder] = useState(false)

	const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value)
		if (e.target.value.trim() !== "") {
			setShowAiPlaceholder(false)
			setTimeout(() => setShowAiPlaceholder(true), 1000)
		} else {
			setShowAiPlaceholder(false)
			setShowAiSearch(false)
		}
	}

	const clearSearch = () => {
		setSearchText("")
		setShowAiSearch(false)
		setShowAiPlaceholder(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchText.trim() !== "") {
			setShowAiSearch(true)
			setAiSearch(searchText)
		}
	}

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<div className="flex h-full w-full justify-center overflow-hidden">
				<div className="w-full max-w-[70%] sm:px-6 lg:px-8">
					<div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300 hover:text-white/60">
						<IoSearch className="absolute left-3 text-black/30 dark:text-white/30" size={20} />
						<input
							type="text"
							autoFocus
							value={searchText}
							onChange={inputChange}
							onKeyDown={handleKeyDown}
							className="bg-input w-full rounded-[10px] p-10 py-3 pl-10 pr-3 font-semibold tracking-wider text-black/70 outline-none placeholder:font-light dark:text-white"
							placeholder="Search..."
						/>

						{showAiPlaceholder && searchText && !showAiSearch && (
							<div className="absolute right-10 text-sm text-black/70 dark:text-white/30">
								press &quot;Enter&quot; for AI search
							</div>
						)}
						{searchText && (
							<IoCloseOutline
								className="absolute right-3 cursor-pointer text-black/70 dark:text-white/30"
								size={20}
								onClick={clearSearch}
							/>
						)}
					</div>
					<div className="my-5 rounded-lg bg-blue-600 p-4 font-semibold text-white">✨ Ask AI</div>
					{showAiSearch ? (
						<div className="relative w-full">
							<div className="absolute left-1/2 w-[110%] -translate-x-1/2">
								<AiSearch searchQuery={searchText} />
							</div>
						</div>
					) : (
						<>
							<div className="my-5 space-y-1">
								<ProfileTitle topicTitle="Topics" spanNumber={1} />
								<ProfileTopics topic="Figma" />
							</div>
							<div className="my-5 space-y-1">
								<ProfileTitle topicTitle="Links" spanNumber={3} />
								<ProfileLinks linklabel="Figma" link="https://figma.com" topic="Figma" />
								<ProfileLinks linklabel="Figma" link="https://figma.com" topic="Figma" />
								<ProfileLinks linklabel="Figma" link="https://figma.com" topic="Figma" />
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
