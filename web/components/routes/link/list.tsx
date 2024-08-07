"use client"

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { PersonalLink } from "@/lib/schema/personal-link"
import { useAtom } from "jotai"
import { linkEditIdAtom, linkSortAtom } from "@/store/link"
import { useKey } from "react-use"
import { useConfirm } from "@omit/react-confirm-dialog"
import { ListItem } from "./list-item"
import { useRef, useState, useCallback, useEffect } from "react"

const LinkList = () => {
	const confirm = useConfirm()
	const { me } = useAccount({
		root: { personalLinks: [] }
	})
	const personalLinks = me?.root?.personalLinks || []

	const [editId, setEditId] = useAtom(linkEditIdAtom)
	const [sort] = useAtom(linkSortAtom)
	const [focusedId, setFocusedId] = useState<string | null>(null)
	const [draggingId, setDraggingId] = useState<string | null>(null)
	const linkRefs = useRef<{ [key: string]: HTMLLIElement | null }>({})

	let sortedLinks =
		sort === "title" && personalLinks
			? [...personalLinks].sort((a, b) => (a?.title || "").localeCompare(b?.title || ""))
			: personalLinks
	sortedLinks = sortedLinks || []

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

	const overlayClick = () => {
		setEditId(null)
	}

	const registerRef = useCallback((id: string, ref: HTMLLIElement | null) => {
		linkRefs.current[id] = ref
	}, [])

	useKey("Escape", () => {
		if (editId) {
			setEditId(null)
		}
	})

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
	}, [me?.root?.personalLinks, sortedLinks, focusedId, editId, sort])

	const updateSequences = (links: PersonalLinkLists) => {
		links.forEach((link, index) => {
			if (link) {
				link.sequence = index
			}
		})
	}

	const handleDragStart = (event: any) => {
		if (sort !== "manual") return
		const { active } = event
		setDraggingId(active.id)
	}

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

	const handleDelete = (linkItem: PersonalLink) => {
		if (!me?.root?.personalLinks) return

		const index = me.root.personalLinks.findIndex(item => item?.id === linkItem.id)
		if (index === -1) {
			console.error("Delete operation fail", { index, linkItem })
			return
		}

		me.root.personalLinks.splice(index, 1)
	}

	return (
		<>
			{editId && <div className="fixed inset-0 z-10" onClick={overlayClick} />}
			<div className="relative z-20">
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
										<ListItem
											key={linkItem.id}
											confirm={confirm}
											isEditing={editId === linkItem.id}
											setEditId={setEditId}
											personalLink={linkItem}
											disabled={sort !== "manual" || editId !== null}
											registerRef={registerRef}
											isDragging={draggingId === linkItem.id}
											isFocused={focusedId === linkItem.id}
											setFocusedId={setFocusedId}
											onDelete={handleDelete}
										/>
									)
							)}
						</ul>
					</SortableContext>
				</DndContext>
			</div>
		</>
	)
}

LinkList.displayName = "LinkList"

export { LinkList }
