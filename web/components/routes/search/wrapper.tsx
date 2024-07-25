"use client"
import { useState } from "react"
import { useAccount } from "@/lib/providers/jazz-provider"
import { IoSearch, IoCloseOutline, IoChevronForward } from "react-icons/io5"
import AiSearch from "../../custom/ai-search"

interface ProfileTopicsProps {
  topic: string
}

const ProfileTopics: React.FC<ProfileTopicsProps> = ({ topic }) => {
  return (
    <div className="flex cursor-pointer flex-row items-center justify-between rounded-lg bg-[#121212] p-3">
      <p>{topic}</p>
      <IoChevronForward className="text-white" size={20} />
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

const ProfileTitle: React.FC<ProfileTitleProps> = ({
  topicTitle,
  spanNumber
}) => {
  return (
    <p className="pb-3 pl-2 text-base font-light text-white/50">
      {topicTitle} <span className="text-white">{spanNumber}</span>
    </p>
  )
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({
  linklabel,
  link,
  topic
}) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-white">
      <div className="flex flex-row items-center space-x-3">
        <p className="text-base text-white">{linklabel}</p>
        <div className="flex cursor-pointer flex-row items-center gap-1">
          <p className="text-md text-white/10 transition-colors duration-300 hover:text-white/30">
            {link}
          </p>
        </div>
      </div>
      <div className="cursor-default rounded-lg bg-[#1a1a1a] p-2 text-white/60">
        {topic}
      </div>
    </div>
  )
}

export const SearchWrapper = () => {
  const account = useAccount()
  const [searchText, setSearchText] = useState("")
  const [aiSearch, setAiSearch] = useState("")
  const [showAiSearch, setShowAiSearch] = useState(false)

  const clearSearch = () => {
    setSearchText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      setShowAiSearch(true)
      setAiSearch(searchText)
    }
  }

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      {/* <SearchHeader /> */}
      <div className="flex h-full w-full justify-center overflow-hidden">
        <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300 hover:text-white/60">
            <IoSearch className="absolute left-3 text-white/30" size={20} />
            <input
              type="text"
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full rounded-[10px] bg-[#16181d] p-10 py-3 pl-10 pr-3 font-semibold tracking-wider text-white outline-none placeholder:font-light placeholder:text-white/30"
              placeholder="Search..."
            />
            {searchText && (
              <IoCloseOutline
                className="absolute right-3 cursor-pointer opacity-30"
                size={20}
                onClick={clearSearch}
              />
            )}
          </div>
          {showAiSearch ? (
            <div className="relative w-full">
              <div className="absolute left-1/2 w-[110%] -translate-x-1/2">
                <AiSearch />
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
                <ProfileLinks
                  linklabel="Figma"
                  link="https://figma.com"
                  topic="Figma"
                />
                <ProfileLinks
                  linklabel="Figma"
                  link="https://figma.com"
                  topic="Figma"
                />
                <ProfileLinks
                  linklabel="Figma"
                  link="https://figma.com"
                  topic="Figma"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
