"use client"

import * as React from "react"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { PersonalPage } from "@/lib/schema/personal-page"
import { useMedia } from "react-use"
import { TopicSelector } from "@/components/custom/topic-selector"

export const DetailPageHeader = ({ page }: { page: PersonalPage }) => {
	const isMobile = useMedia("(max-width: 770px)")

	return (
		isMobile && (
			<>
				<ContentHeader className="lg:min-h-0">
					<div className="flex min-w-0 gap-2">
						<SidebarToggleButton />
					</div>
				</ContentHeader>

				<div className="flex flex-row items-start justify-between border-b px-6 py-2 max-lg:pl-4">
					<TopicSelector
						value={page.topic?.name}
						onTopicChange={topic => {
							page.topic = topic
							page.updatedAt = new Date()
						}}
						align="start"
					/>
				</div>
			</>
		)
	)
}
