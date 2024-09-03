import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LinkItem } from "./link-item"
import { LaAccount, PersonalLinkLists, Section as SectionSchema, Topic, UserRoot } from "@/lib/schema"
import { Skeleton } from "@/components/ui/skeleton"
import { LaIcon } from "@/components/custom/la-icon"

interface SectionProps {
	topic: Topic
	section: SectionSchema
	activeIndex: number
	startIndex: number
	linkRefs: React.MutableRefObject<(HTMLLIElement | null)[]>
	setActiveIndex: (index: number) => void
	me: {
		root: {
			personalLinks: PersonalLinkLists
		} & UserRoot
	} & LaAccount
	personalLinks: PersonalLinkLists
}

export function Section({
	topic,
	section,
	activeIndex,
	setActiveIndex,
	startIndex,
	linkRefs,
	me,
	personalLinks
}: SectionProps) {
	const [nLinksToLoad, setNLinksToLoad] = useState(10)

	const linksToLoad = useMemo(() => {
		return section.links?.slice(0, nLinksToLoad)
	}, [section.links, nLinksToLoad])

	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-4 px-6 py-2 max-lg:px-4">
				<p className="text-foreground text-sm font-medium">{section.title}</p>
				<div className="flex-1 border-b"></div>
			</div>

			<div className="flex flex-col gap-px py-2">
				{linksToLoad?.map((link, index) =>
					link?.url ? (
						<LinkItem
							key={index}
							topic={topic}
							link={link}
							isActive={activeIndex === startIndex + index}
							index={startIndex + index}
							setActiveIndex={setActiveIndex}
							ref={el => {
								linkRefs.current[startIndex + index] = el
							}}
							me={me}
							personalLinks={personalLinks}
						/>
					) : (
						<Skeleton key={index} className="h-14 w-full xl:h-11" />
					)
				)}
				{section.links?.length && section.links?.length > nLinksToLoad && (
					<LoadMoreSpinner onLoadMore={() => setNLinksToLoad(n => n + 10)} />
				)}
			</div>
		</div>
	)
}

const LoadMoreSpinner = ({ onLoadMore }: { onLoadMore: () => void }) => {
	const spinnerRef = useRef<HTMLDivElement>(null)

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries
			if (entry.isIntersecting) {
				onLoadMore()
			}
		},
		[onLoadMore]
	)

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: "0px",
			threshold: 1.0
		})

		const currentSpinnerRef = spinnerRef.current

		if (currentSpinnerRef) {
			observer.observe(currentSpinnerRef)
		}

		return () => {
			if (currentSpinnerRef) {
				observer.unobserve(currentSpinnerRef)
			}
		}
	}, [handleIntersection])

	return (
		<div ref={spinnerRef} className="flex justify-center py-4">
			<LaIcon name="Loader" className="size-6 animate-spin" />
		</div>
	)
}
