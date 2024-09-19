import React, { useCallback, useEffect, useMemo } from "react"
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
import { Primitive } from "@radix-ui/react-primitive"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { useKey } from "react-use"
import { LinkItem } from "./partials/link-item"
import { useQueryState } from "nuqs"
import { learningStateAtom } from "./header"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useLinkActions } from "./hooks/use-link-actions"
import { isDeleteConfirmShownAtom } from "./LinkRoute"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"

interface LinkListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

const LinkList: React.FC<LinkListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const [isCommandPalettePpen] = useAtom(commandPaletteOpenAtom)
	const [, setIsDeleteConfirmShown] = useAtom(isDeleteConfirmShownAtom)
	const [editId, setEditId] = useQueryState("editId")
	const [activeLearningState] = useAtom(learningStateAtom)
	const [draggingId, setDraggingId] = React.useState<UniqueIdentifier | null>(null)

	const { deleteLink } = useLinkActions()
	const confirm = useConfirm()

	const { me } = useAccount({
		root: { personalLinks: [] }
	})
	const personalLinks = useMemo(() => me?.root?.personalLinks || [], [me?.root?.personalLinks])

	const [sort] = useAtom(linkSortAtom)

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

	useKey(
		event => (event.metaKey || event.ctrlKey) && event.key === "Backspace",
		async () => {
			if (activeItemIndex !== null) {
				setIsDeleteConfirmShown(true)
				const activeLink = sortedLinks[activeItemIndex]
				if (activeLink) {
					const result = await confirm({
						title: `Delete "${activeLink.title}"?`,
						description: "This action cannot be undone.",
						alertDialogTitle: {
							className: "text-base"
						},
						cancelButton: {
							variant: "outline"
						},
						confirmButton: {
							variant: "destructive"
						}
					})

					if (result) {
						if (!me) return
						deleteLink(me, activeLink)

						setIsDeleteConfirmShown(false)
					} else {
						setIsDeleteConfirmShown(false)
					}
				}
			}
		},
		{ event: "keydown" }
	)

	// on mounted, if editId is set, set activeItemIndex to the index of the item with the editId
	useEffect(() => {
		if (editId) {
			const index = sortedLinks.findIndex(link => link?.id === editId)
			if (index !== -1) {
				setActiveItemIndex(index)
			}
		}
	}, [editId, sortedLinks, setActiveItemIndex])

	const updateSequences = useCallback((links: PersonalLinkLists) => {
		links.forEach((link, index) => {
			if (link) {
				link.sequence = index
			}
		})
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isCommandPalettePpen || !me?.root?.personalLinks || sortedLinks.length === 0 || editId !== null) return

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				setActiveItemIndex(prevIndex => {
					if (prevIndex === null) return 0
					const newIndex =
						e.key === "ArrowUp" ? Math.max(0, prevIndex - 1) : Math.min(sortedLinks.length - 1, prevIndex + 1)

					if (e.metaKey && sort === "manual") {
						const linksArray = [...me.root.personalLinks]
						const newLinks = arrayMove(linksArray, prevIndex, newIndex)

						while (me.root.personalLinks.length > 0) {
							me.root.personalLinks.pop()
						}

						newLinks.forEach(link => {
							if (link) {
								me.root.personalLinks.push(link)
							}
						})

						updateSequences(me.root.personalLinks)
					}

					return newIndex
				})
			} else if (e.key === "Enter" && !disableEnterKey && activeItemIndex !== null) {
				e.preventDefault()
				const activeLink = sortedLinks[activeItemIndex]
				if (activeLink) {
					setEditId(activeLink.id)
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [
		me?.root?.personalLinks,
		sortedLinks,
		editId,
		sort,
		updateSequences,
		isCommandPalettePpen,
		activeItemIndex,
		setEditId,
		setActiveItemIndex,
		disableEnterKey
	])

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
				setActiveItemIndex(newIndex)
			} catch (error) {
				console.error("Error during link reordering:", error)
			}
		}

		setDraggingId(null)
	}

	const setElementRef = useActiveItemScroll<HTMLLIElement>({ activeIndex: activeItemIndex })

	return (
		<Primitive.div
			className="mb-11 flex w-full flex-1 flex-col overflow-y-auto outline-none [scrollbar-gutter:stable]"
			tabIndex={0}
		>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={sortedLinks.map(item => item?.id || "") || []} strategy={verticalListSortingStrategy}>
					<ul role="list" className="divide-primary/5 divide-y">
						{sortedLinks.map(
							(linkItem, index) =>
								linkItem && (
									<LinkItem
										key={linkItem.id}
										isEditing={editId === linkItem.id}
										setEditId={setEditId}
										personalLink={linkItem}
										disabled={sort !== "manual" || editId !== null}
										isDragging={draggingId === linkItem.id}
										isActive={activeItemIndex === index}
										setActiveItemIndex={setActiveItemIndex}
										index={index}
										ref={el => setElementRef(el, index)}
									/>
								)
						)}
					</ul>
				</SortableContext>
			</DndContext>
		</Primitive.div>
	)
}

LinkList.displayName = "LinkList"

export { LinkList }
