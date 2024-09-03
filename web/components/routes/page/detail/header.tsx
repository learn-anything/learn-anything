"use client"

import * as React from "react"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { PersonalPage } from "@/lib/schema/personal-page"
import { useMedia } from "react-use"
import { TopicSelector } from "@/components/custom/topic-selector"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"

export const DetailPageHeader = ({ page, handleDelete }: { page: PersonalPage; handleDelete: () => void }) => {
	const isMobile = useMedia("(max-width: 770px)")

	return (
		isMobile && (
			<>
				<ContentHeader className="lg:min-h-0">
					<div className="flex min-w-0 gap-2">
						<SidebarToggleButton />
					</div>
				</ContentHeader>

				<div className="flex flex-row items-start gap-1.5 border-b px-6 py-2 max-lg:pl-4">
					<TopicSelector
						value={page.topic?.name}
						onTopicChange={topic => {
							page.topic = topic
							page.updatedAt = new Date()
						}}
						align="start"
						variant="outline"
						renderSelectedText={() => <span className="truncate">{page.topic?.prettyName || "Select a topic"}</span>}
					/>
					<Button size="sm" variant="outline" onClick={handleDelete}>
						<LaIcon name="Trash" className="mr-2 size-3.5" />
						Delete
					</Button>
				</div>
			</>
		)
	)
}
