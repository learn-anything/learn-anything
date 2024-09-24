"use client"

import { TopicHeader } from "./header"
import { TopicList } from "./list"

export function TopicRoute() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<TopicHeader />
			<TopicList />
		</div>
	)
}
