"use client"
import { useState } from "react"
import { ContentHeader } from "@/components/custom/content-header"

export function JournalRoute() {
	return (
		<div className="flex h-full flex-auto flex-col">
			<ContentHeader className="px-6 py-4"></ContentHeader>
			<div className="relative flex flex-1 justify-center overflow-hidden"></div>
		</div>
	)
}
