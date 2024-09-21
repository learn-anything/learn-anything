import React, { useCallback, useMemo } from "react"
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
	UniqueIdentifier,
	MeasuringStrategy,
	TouchSensor
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { MeasuringConfiguration } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { useKey } from "react-use"
import { LinkItem } from "./partials/link-item"
import { parseAsBoolean, useQueryState } from "nuqs"
import { learningStateAtom } from "./header"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useLinkActions } from "./hooks/use-link-actions"
import { isDeleteConfirmShownAtom } from "./LinkRoute"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { useKeyboardManager } from "@/hooks/use-keyboard-manager"
import { useKeydownListener } from "@/hooks/use-keydown-listener"
import { useTouchSensor } from "@/hooks/use-touch-sensor"

interface LinkListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	keyboardActiveIndex: number | null
	setKeyboardActiveIndex: React.Dispatch<React.SetStateAction<number | null>>
}

const measuring: MeasuringConfiguration = {
	droppable: {
		strategy: MeasuringStrategy.Always
	}
}

const LinkList: React.FC<LinkListProps> = ({
	activeItemIndex,
	setActiveItemIndex,
	keyboardActiveIndex,
	setKeyboardActiveIndex
}) => {
	const isTouchDevice = useTouchSensor()
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const [, setIsDeleteConfirmShown] = useAtom(isDeleteConfirmShownAtom)
	const [editId, setEditId] = useQueryState("editId")
	const [createMode] = useQueryState("create", parseAsBoolean)
	const [activeLearningState] = useAtom(learningStateAtom)
	const [draggingId, setDraggingId] = React.useState<UniqueIdentifier | null>(null)
	const [sort] = useAtom(linkSortAtom)

	const { deleteLink } = useLinkActions()
	const confirm = useConfirm()
	const { me } = useAccount({ root: { personalLinks: [] } })
	const { isKeyboardDisabled } = useKeyboardManager("XComponent")

	const personalLinks = useMemo(() => me?.root?.personalLinks || [], [me?.root?.personalLinks])

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
		useSensor(isTouchDevice ? TouchSensor : PointerSensor, {
			activationConstraint: {
				distance: 5
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const updateSequences = useCallback((links: PersonalLinkLists) => {
		links.forEach((link, index) => {
			if (link) {
				link.sequence = index
			}
		})
	}, [])

	const handleDeleteLink = useCallback(async () => {
		if (activeItemIndex === null) return
		setIsDeleteConfirmShown(true)
		const activeLink = sortedLinks[activeItemIndex]
		if (!activeLink || !me) return

		const result = await confirm({
			title: `Delete "${activeLink.title}"?`,
			description: "This action cannot be undone.",
			alertDialogTitle: { className: "text-base" },
			cancelButton: { variant: "outline" },
			confirmButton: { variant: "destructive" }
		})

		if (result) {
			deleteLink(me, activeLink)
		}
		setIsDeleteConfirmShown(false)
	}, [activeItemIndex, sortedLinks, me, confirm, deleteLink, setIsDeleteConfirmShown])

	useKey(event => (event.metaKey || event.ctrlKey) && event.key === "Backspace", handleDeleteLink, { event: "keydown" })

	useKeydownListener((e: KeyboardEvent) => {
		if (
			isKeyboardDisabled ||
			isCommandPaletteOpen ||
			!me?.root?.personalLinks ||
			sortedLinks.length === 0 ||
			editId !== null ||
			e.defaultPrevented
		)
			return

		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown":
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

					setKeyboardActiveIndex(newIndex)

					return newIndex
				})
				break
			case "Home":
				e.preventDefault()
				setActiveItemIndex(0)
				break
			case "End":
				e.preventDefault()
				setActiveItemIndex(sortedLinks.length - 1)
				break
		}
	})

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			if (sort !== "manual") return
			if (!me) return

			const { active } = event
			const activeIndex = me?.root.personalLinks.findIndex(item => item?.id === active.id)

			if (activeIndex === -1) {
				console.error("Drag operation fail", { activeIndex, activeId: active.id })
				return
			}

			setActiveItemIndex(activeIndex)
			setDraggingId(active.id)
		},
		[sort, me, setActiveItemIndex]
	)

	const handleDragCancel = useCallback(() => {
		setDraggingId(null)
	}, [])

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

		setActiveItemIndex(null)
		setDraggingId(null)
	}

	const { setElementRef } = useActiveItemScroll<HTMLDivElement>({ activeIndex: keyboardActiveIndex })

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
			measuring={measuring}
			modifiers={[restrictToVerticalAxis]}
		>
			<div className="relative flex h-full grow items-stretch overflow-hidden">
				<SortableContext items={sortedLinks.map(item => item?.id || "") || []} strategy={verticalListSortingStrategy}>
					<div className="relative flex h-full grow flex-col items-stretch overflow-hidden">
						<div className="flex h-full w-[calc(100%+0px)] flex-col overflow-hidden pr-0">
							<div className="relative overflow-y-auto overflow-x-hidden [scrollbar-gutter:auto]">
								{sortedLinks.map(
									(linkItem, index) =>
										linkItem && (
											<LinkItem
												key={linkItem.id}
												isActive={activeItemIndex === index}
												personalLink={linkItem}
												editId={editId}
												setEditId={setEditId}
												disabled={sort !== "manual" || editId !== null}
												setActiveItemIndex={setActiveItemIndex}
												onPointerMove={() => {
													if (editId !== null || draggingId !== null || createMode) {
														return undefined
													}

													setKeyboardActiveIndex(null)
													setActiveItemIndex(index)
												}}
												index={index}
												onItemSelected={link => setEditId(link.id)}
												data-keyboard-active={keyboardActiveIndex === index}
												ref={el => setElementRef(el, index)}
											/>
										)
								)}
							</div>
						</div>
					</div>
				</SortableContext>
			</div>
		</DndContext>
	)
}

LinkList.displayName = "LinkList"

export { LinkList }
