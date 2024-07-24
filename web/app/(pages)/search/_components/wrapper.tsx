"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
import { Sidebar } from "@/components/custom/sidebar"
import { Icons } from "next/dist/lib/metadata/types/metadata-types"
// import { IoSearch, IoCloseOutline } from "react-icons/io5"

export const SearchWrapper = () => {
  const account = useAccount()
  return (
    <div className="box-border flex h-screen w-screen overflow-hidden text-white">
      <div className="w-1/7 mr-2">
        {" "}
        <Sidebar />{" "}
      </div>
      <div className="mr-2 mt-2 flex h-full w-full justify-center rounded-[20px] border border-white/10">
        <div className="w-[55%]">
          <div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300 hover:text-white/60">
            {/* <IoSearch className="absolute left-2 text-white/30" size={20} /> */}
            <input
              type="text"
              autoFocus
              className="w-full rounded-[10px] bg-[#16181d] py-3 pl-10 pr-10 font-light tracking-wider text-white/70 outline-none placeholder:font-light placeholder:text-white/30"
              placeholder="Search..."
            />
            {/* <IoCloseOutline
              className="absolute right-2 text-white/30"
              size={20}
            /> */}
          </div>
          <div className="mx-auto my-5 justify-center space-y-1">
            <p className="pb-3 pl-2 text-base font-light text-white/50">
              Topics <span className="text-white/70">1</span>
            </p>
            <ProfileTopics topic="Figma" />
          </div>

          <div className="mx-auto my-5 justify-center space-y-1">
            <p className="pb-3 pl-2 text-base font-light text-white/50">
              Links <span className="text-white/70">3</span>
            </p>
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
        </div>
      </div>
    </div>
  )
}

interface ProfileTopicsProps {
  topic: string
}

const ProfileTopics: React.FC<ProfileTopicsProps> = ({ topic }) => {
  return (
    <div className="flex cursor-pointer flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-white">
      <p>{topic}</p>
      {/* <icons.VectorArrowRight /> */}
    </div>
  )
}

interface ProfileLinksProps {
  linklabel: string
  link: string
  topic: string
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({
  linklabel,
  link,
  topic
}) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-white">
      <div className="flex flex-row items-center space-x-3">
        <p className="text-base text-white/90">{linklabel}</p>
        <div className="flex cursor-pointer flex-row items-center gap-1">
          {/* <icons.Link /> */}
          <p className="text-sm text-white/10 transition-colors duration-300 hover:text-white/30">
            {link}
          </p>
        </div>
      </div>
      <div className="cursor-default rounded-lg bg-[#1a1a1a] p-2 text-white/50">
        {topic}
      </div>
    </div>
  )
}
