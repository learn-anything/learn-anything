import React from "react"
import { LinkItem } from "./link-item"
import { Section as SectionSchema } from "@/lib/schema"

interface SectionProps {
	section: SectionSchema
	activeIndex: number
	startIndex: number
	linkRefs: React.MutableRefObject<(HTMLLIElement | null)[]>
	setActiveIndex: (index: number) => void
}

export function Section({ section, activeIndex, setActiveIndex, startIndex, linkRefs }: SectionProps) {
	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-4 px-6 py-2 max-lg:px-4">
				<p className="text-foreground text-sm font-medium">{section.title}</p>
				<div className="flex-1 border-b"></div>
			</div>

			<div className="flex flex-col gap-px py-2">
				{section.links?.map(
					(link, index) =>
						link?.url && (
							<LinkItem
								key={index}
								link={link}
								isActive={activeIndex === startIndex + index}
								index={startIndex + index}
								setActiveIndex={setActiveIndex}
								ref={el => {
									linkRefs.current[startIndex + index] = el
								}}
							/>
						)
				)}
			</div>
		</div>
	)
}
