"use client"
import React from "react"

interface AiSearchProps {
  searchQuery: string
}

const AiSearch: React.FC<AiSearchProps> = ({ searchQuery }) => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <div className="w-full rounded-lg bg-inherit p-6 text-white">
        <div className="mb-6 rounded-lg bg-blue-700 p-4">
          <h2 className="text-lg font-medium">✨ This is what I have found:</h2>
        </div>
        <div className="rounded-xl bg-[#121212] p-4">
          <h1 className="text-md mb-4 border-b border-neutral-800 pb-2 font-semibold tracking-wider text-white opacity-50">
            {searchQuery}
          </h1>
          <p className="min-h-[100px] whitespace-pre-wrap">
            {/* AI content */}
          </p>
        </div>
      </div>
      <p className="text-md pb-5 font-semibold opacity-50">Not answered?</p>
      <button className="text-md rounded-2xl bg-neutral-800 px-6 py-3 font-semibold text-opacity-50 shadow-inner shadow-neutral-700/50 transition-colors hover:bg-neutral-700">
        Ask Community
      </button>
    </div>
  )
}

export default AiSearch
