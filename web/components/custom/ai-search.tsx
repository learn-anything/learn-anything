"use client"
import React from "react"

const AiSearch = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <div className="w-full rounded-lg bg-inherit p-6 text-white">
        <div className="mb-6 rounded-lg bg-blue-600 p-4">
          <h2 className="text-xl font-semibold">
            ✨ This is what I have found:
          </h2>
        </div>
        <div className="rounded-xl bg-[#121212] p-4">
          <h1 className="text-md mb-4 opacity-50">How to quit Figma?</h1>
          <p className="mb-4">To quit Figma, you can follow these steps:</p>
          <div className="mb-4">
            <span className="font-semibold">1. Windows or Linux</span>
            <ul className="ml-6 mt-2 list-disc">
              <li>
                Click on the "File" menu in the top-left corner of the Figma
                window.
              </li>
              <li>Select "Quit Figma" from the dropdown menu.</li>
            </ul>
          </div>
          <div className="mb-4">
            <span className="font-semibold">2. Mac</span>
            <ul className="ml-6 mt-2 list-disc">
              <li>
                Click on the "Figma" menu in the top-left corner of the screen
                (next to the Apple logo).
              </li>
              <li>Select "Quit Figma" from the dropdown menu.</li>
            </ul>
          </div>
          <p className="mb-2">
            Alternatively, you can use the keyboard shortcut to quit Figma:
          </p>
          <ul className="mb-4 ml-6 list-disc">
            <li>Windows: Press Alt + F4.</li>
            <li>Mac: Press Cmd + Q.</li>
          </ul>
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
