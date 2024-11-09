import * as React from "react"
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
  TouchSensor,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import type { MeasuringConfiguration } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PersonalLinkLists } from "@/lib/schema/personal-link"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { LinkItem } from "./-item"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useKeyDown } from "@/hooks/use-key-down"
import { useTouchSensor } from "~/hooks/use-touch-sensor"
import { useActiveItemScroll } from "~/hooks/use-active-item-scroll"
import { isDeleteConfirmShownAtom } from "."
import { useLinkActions } from "~/hooks/actions/use-link-actions"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { isModKey } from "@shared/utils"

interface LinkListProps {}

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const LinkList: React.FC<LinkListProps> = () => {
  const navigate = useNavigate()
  const isTouchDevice = useTouchSensor()
  const lastActiveIndexRef = React.useRef<number | null>(null)
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null,
  )
  const [keyboardActiveIndex, setKeyboardActiveIndex] = React.useState<
    number | null
  >(null)
  const [, setIsDeleteConfirmShown] = useAtom(isDeleteConfirmShownAtom)
  const {
    create: createMode,
    editId,
    state,
  } = useSearch({
    from: "/_layout/_pages/_protected/links/",
  })
  const [draggingId, setDraggingId] = React.useState<UniqueIdentifier | null>(
    null,
  )
  const [sort] = useAtom(linkSortAtom)

  const { deleteLink } = useLinkActions()
  const confirm = useConfirm()
  const { me } = useAccount({
    root: {
      personalLinks: [
        {
          topic: [],
        },
      ],
    },
  })

  const personalLinks = me?.root.personalLinks || []
  const filteredLinks = personalLinks.filter((link) => {
    if (state === "all") return true
    if (!link?.learningState) return false
    return link.learningState === state
  })
  const sortedLinks =
    sort === "title"
      ? [...filteredLinks].sort((a, b) =>
          (a?.title || "").localeCompare(b?.title || ""),
        )
      : filteredLinks

  React.useEffect(() => {
    if (editId) {
      const index = sortedLinks.findIndex((link) => link?.id === editId)
      if (index !== -1) {
        lastActiveIndexRef.current = index
        setActiveItemIndex(index)
        setKeyboardActiveIndex(index)
      }
    }
  }, [editId, setActiveItemIndex, setKeyboardActiveIndex, sortedLinks])

  const sensors = useSensors(
    useSensor(isTouchDevice ? TouchSensor : PointerSensor, {
      activationConstraint: {
        ...(isTouchDevice ? { delay: 100, tolerance: 5 } : {}),
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const updateSequences = React.useCallback((links: PersonalLinkLists) => {
    links.forEach((link, index) => {
      if (link) {
        link.sequence = index
      }
    })
  }, [])

  const handleDeleteLink = React.useCallback(async () => {
    if (activeItemIndex === null) return
    setIsDeleteConfirmShown(true)
    const activeLink = sortedLinks[activeItemIndex]
    if (!activeLink || !me) return

    const result = await confirm({
      title: `Delete "${activeLink.title}"?`,
      description: "This action cannot be undone.",
      alertDialogTitle: { className: "text-base" },
      cancelButton: { variant: "outline" },
      confirmButton: { variant: "destructive" },
    })

    if (result) {
      deleteLink(me, activeLink)
    }
    setIsDeleteConfirmShown(false)
  }, [
    activeItemIndex,
    sortedLinks,
    me,
    confirm,
    deleteLink,
    setIsDeleteConfirmShown,
  ])

  useKeyDown((e) => isModKey(e) && e.key === "Backspace", handleDeleteLink)

  const next = () =>
    Math.min((activeItemIndex ?? 0) + 1, sortedLinks.length - 1)

  const prev = () => Math.max((activeItemIndex ?? 0) - 1, 0)

  const handleKeyDown = (ev: KeyboardEvent) => {
    switch (ev.key) {
      case "ArrowDown":
        ev.preventDefault()
        ev.stopPropagation()
        setActiveItemIndex(next())
        setKeyboardActiveIndex(next())
        break
      case "ArrowUp":
        ev.preventDefault()
        ev.stopPropagation()
        setActiveItemIndex(prev())
        setKeyboardActiveIndex(prev())
    }
  }

  useKeyDown(() => true, handleKeyDown)

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      if (sort !== "manual") return
      if (!me) return

      const { active } = event
      const activeIndex = me?.root.personalLinks.findIndex(
        (item) => item?.id === active.id,
      )

      if (activeIndex === -1) {
        console.error("Drag operation fail", {
          activeIndex,
          activeId: active.id,
        })
        return
      }

      setActiveItemIndex(activeIndex)
      setDraggingId(active.id)
    },
    [sort, me, setActiveItemIndex],
  )

  const handleDragCancel = React.useCallback(() => {
    setDraggingId(null)
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!active || !over || !me?.root.personalLinks) {
      console.error("Drag operation fail", { active, over })
      return
    }

    const oldIndex = me.root.personalLinks.findIndex(
      (item) => item?.id === active.id,
    )
    const newIndex = me.root.personalLinks.findIndex(
      (item) => item?.id === over.id,
    )

    if (oldIndex === -1 || newIndex === -1) {
      console.error("Drag operation fail", {
        oldIndex,
        newIndex,
        activeId: active.id,
        overId: over.id,
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

        updatedLinks.forEach((link) => {
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

  const { setElementRef } = useActiveItemScroll<HTMLDivElement>({
    activeIndex: keyboardActiveIndex,
  })

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
      <div
        className="relative flex h-full grow items-stretch overflow-hidden"
        tabIndex={-1}
      >
        <SortableContext
          items={sortedLinks.map((item) => item?.id || "") || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative flex h-full grow flex-col items-stretch overflow-hidden">
            <div className="flex h-full w-[calc(100%+0px)] flex-col overflow-hidden pr-0">
              <div className="relative overflow-y-auto overflow-x-hidden [scrollbar-gutter:auto]">
                {sortedLinks.map((linkItem, index) => (
                  <LinkItem
                    key={linkItem.id}
                    isActive={activeItemIndex === index}
                    personalLink={linkItem}
                    editId={editId}
                    disabled={sort !== "manual" || !!editId}
                    onPointerMove={() => {
                      if (editId || draggingId || createMode) {
                        return undefined
                      }

                      setKeyboardActiveIndex(null)
                      setActiveItemIndex(index)
                    }}
                    onFormClose={async () => {
                      navigate({ to: "/links" })
                      setActiveItemIndex(lastActiveIndexRef.current)
                      setKeyboardActiveIndex(lastActiveIndexRef.current)
                    }}
                    onItemSelected={(link) =>
                      navigate({
                        to: "/links",
                        search: { editId: link.id },
                      })
                    }
                    data-keyboard-active={keyboardActiveIndex === index}
                    ref={(el) => setElementRef(el, index)}
                  />
                ))}
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
