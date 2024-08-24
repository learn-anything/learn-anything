"use client"

import React from "react"
import Link from "next/link"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import { TopicDetailHeader } from "./Header"
import { LaIcon } from "@/components/custom/la-icon"
import { cn, ensureUrlProtocol } from "@/lib/utils"
import { Section as SectionSchema, Link as LinkSchema } from "@/lib/schema"

interface TopicDetailRouteProps {
	topicName: string
}

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const topics = useCoState(PublicGlobalGroup, process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>, {
		root: {
			topics: []
		}
	})

	const topic = topics?.root.topics.find(topic => topic?.name === topicName)

	if (!topic) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<TopicDetailHeader topic={topic} />
			<div className="flex w-full flex-1 flex-col gap-4 focus-visible:outline-none">
				<div tabIndex={-1} className="outline-none">
					<div className="flex flex-1 flex-col gap-4" role="listbox" aria-label="Topic sections">
						{topic.latestGlobalGuide?.sections?.map(
							(section, index) => section?.id && <Section key={index} section={section} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

interface SectionProps {
	section: SectionSchema
}

function Section({ section }: SectionProps) {
	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-4 px-4 py-2">
				<p className="text-foreground text-sm font-medium">{section.title}</p>
				<div className="border-b-secondary flex-1 border-b"></div>
			</div>

			<div className="flex flex-col gap-px py-2">
				{section.links?.map((link, index) => link?.url && <LinkItem key={index} link={link} />)}
			</div>
		</div>
	)
}

interface LinkItemProps {
	link: LinkSchema
}

function LinkItem({ link }: LinkItemProps) {
	return (
		<li
			tabIndex={0}
			className={cn("hover:bg-muted/50 relative flex h-14 cursor-default items-center outline-none xl:h-11")}
		>
			<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
				<div className="flex min-w-0 items-center gap-x-4">
					<LaIcon name="GraduationCap" className="size-5" />
					<div className="w-full min-w-0 flex-auto">
						<div className="gap-x-2 space-y-0.5 xl:flex xl:flex-row">
							<p className="text-primary hover:text-primary line-clamp-1 text-sm font-medium xl:truncate">
								{link.title}
							</p>

							<div className="group flex items-center gap-x-1">
								<LaIcon
									name="Link"
									aria-hidden="true"
									className="text-muted-foreground group-hover:text-primary size-3 flex-none"
								/>
								<Link
									href={ensureUrlProtocol(link.url)}
									passHref
									prefetch={false}
									target="_blank"
									onClick={e => e.stopPropagation()}
									className="text-muted-foreground hover:text-primary text-xs"
								>
									<span className="xl:truncate">{link.url}</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-x-4"></div>
			</div>
		</li>
	)
}
