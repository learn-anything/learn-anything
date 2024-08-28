import React from "react"
import { Section } from "./section"
import { LaAccount, ListOfSections, PersonalLinkLists, UserRoot } from "@/lib/schema"

interface TopicSectionsProps {
	sections: (ListOfSections | null) | undefined
	activeIndex: number
	setActiveIndex: (index: number) => void
	linkRefs: React.MutableRefObject<(HTMLLIElement | null)[]>
	containerRef: React.RefObject<HTMLDivElement>
	me: {
		root: {
			personalLinks: PersonalLinkLists
		} & UserRoot
	} & LaAccount
	personalLinks: PersonalLinkLists
}

export function TopicSections({
	sections,
	activeIndex,
	setActiveIndex,
	linkRefs,
	containerRef,
	me,
	personalLinks
}: TopicSectionsProps) {
	return (
		<div ref={containerRef} className="flex w-full flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
			<div tabIndex={-1} className="outline-none">
				<div className="flex flex-1 flex-col gap-4" role="listbox" aria-label="Topic sections">
					{sections?.map(
						(section, sectionIndex) =>
							section?.id && (
								<Section
									key={sectionIndex}
									section={section}
									activeIndex={activeIndex}
									setActiveIndex={setActiveIndex}
									startIndex={sections.slice(0, sectionIndex).reduce((acc, s) => acc + (s?.links?.length || 0), 0)}
									linkRefs={linkRefs}
									me={me}
									personalLinks={personalLinks}
								/>
							)
					)}
				</div>
			</div>
		</div>
	)
}
