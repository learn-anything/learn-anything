"use client"

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	UniqueIdentifier
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { useKey } from "react-use"
import { LinkItem } from "./partials/link-item"
import { useRef, useState, useCallback, useEffect, useMemo } from "react"
import { learningStateAtom } from "./header"
import { useQueryState } from "nuqs"

interface LinkListProps {}

const LinkList: React.FC<LinkListProps> = () => {
	const [editId, setEditId] = useQueryState("editId")
	const [activeLearningState] = useAtom(learningStateAtom)

	const { me } = useAccount({
		root: { personalLinks: [] }
	})
	const personalLinks = useMemo(() => me?.root?.personalLinks || [], [me?.root?.personalLinks])

	const [sort] = useAtom(linkSortAtom)
	const [focusedId, setFocusedId] = useState<string | null>(null)
	const [draggingId, setDraggingId] = useState<UniqueIdentifier | null>(null)
	const linkRefs = useRef<{ [key: string]: HTMLLIElement | null }>({})

	const filteredLinks = useMemo(
		() =>
			personalLinks.filter(link => {
				if (activeLearningState === "all") return true
				if (!link?.learningState) return false
				return link.learningState === activeLearningState
			}),
		[personalLinks, activeLearningState]
	)

	const sortedLinks = useMemo(
		() =>
			sort === "title"
				? [...filteredLinks].sort((a, b) => (a?.title || "").localeCompare(b?.title || ""))
				: filteredLinks,
		[filteredLinks, sort]
	)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const registerRef = useCallback((id: string, ref: HTMLLIElement | null) => {
		linkRefs.current[id] = ref
	}, [])

	useKey("Escape", () => {
		if (editId) {
			setEditId(null)
		}
	})

	const updateSequences = useCallback((links: PersonalLinkLists) => {
		links.forEach((link, index) => {
			if (link) {
				link.sequence = index
			}
		})
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!me?.root?.personalLinks || sortedLinks.length === 0 || editId !== null) return

			const currentIndex = sortedLinks.findIndex(link => link?.id === focusedId)

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				const newIndex =
					e.key === "ArrowUp" ? Math.max(0, currentIndex - 1) : Math.min(sortedLinks.length - 1, currentIndex + 1)

				if (e.metaKey && sort === "manual") {
					const currentLink = me.root.personalLinks[currentIndex]
					if (!currentLink) return

					const linksArray = [...me.root.personalLinks]
					const newLinks = arrayMove(linksArray, currentIndex, newIndex)

					while (me.root.personalLinks.length > 0) {
						me.root.personalLinks.pop()
					}

					newLinks.forEach(link => {
						if (link) {
							me.root.personalLinks.push(link)
						}
					})

					updateSequences(me.root.personalLinks)

					const newFocusedLink = me.root.personalLinks[newIndex]
					if (newFocusedLink) {
						setFocusedId(newFocusedLink.id)

						requestAnimationFrame(() => {
							linkRefs.current[newFocusedLink.id]?.focus()
						})
					}
				} else {
					const newFocusedLink = sortedLinks[newIndex]
					if (newFocusedLink) {
						setFocusedId(newFocusedLink.id)
						requestAnimationFrame(() => {
							linkRefs.current[newFocusedLink.id]?.focus()
						})
					}
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [me?.root?.personalLinks, sortedLinks, focusedId, editId, sort, updateSequences])

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			if (sort !== "manual") return
			const { active } = event
			setDraggingId(active.id)
		},
		[sort]
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!active || !over || !me?.root?.personalLinks) {
			console.error("Drag operation fail", { active, over })
			return
		}

		const oldIndex = me.root.personalLinks.findIndex(item => item?.id === active.id)
		const newIndex = me.root.personalLinks.findIndex(item => item?.id === over.id)

		if (oldIndex === -1 || newIndex === -1) {
			console.error("Drag operation fail", {
				oldIndex,
				newIndex,
				activeId: active.id,
				overId: over.id
			})
			return
		}

		if (oldIndex !== newIndex) {
			try {
				const personalLinksArray = [...me.root.personalLinks]
				const updatedLinks = arrayMove(personalLinksArray, oldIndex, newIndex)

				while (me.root.personalLinks.length > 0) {
					me.root.personalLinks.pop()
				}

				updatedLinks.forEach(link => {
					if (link) {
						me.root.personalLinks.push(link)
					}
				})

				updateSequences(me.root.personalLinks)
			} catch (error) {
				console.error("Error during link reordering:", error)
			}
		}

		setDraggingId(null)
	}

	return (
		<div className="mb-14 flex w-full flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={sortedLinks.map(item => item?.id || "") || []} strategy={verticalListSortingStrategy}>
					<ul role="list" className="divide-primary/5 divide-y">
						{sortedLinks.map(
							linkItem =>
								linkItem && (
									<LinkItem
										key={linkItem.id}
										isEditing={editId === linkItem.id}
										setEditId={setEditId}
										personalLink={linkItem}
										disabled={sort !== "manual" || editId !== null}
										registerRef={registerRef}
										isDragging={draggingId === linkItem.id}
										isFocused={focusedId === linkItem.id}
										setFocusedId={setFocusedId}
									/>
								)
						)}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	)
}

LinkList.displayName = "LinkList"

export { LinkList }
