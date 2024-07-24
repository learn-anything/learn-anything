"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useAccount } from "@/lib/providers/jazz-provider"
import { TodoItem } from "@/lib/schema"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"

interface SortableItemProps {
  todoItem: TodoItem
  index: number
  onCheck: (index: number) => void
  disabled?: boolean
}

export const LinkList = () => {
  const [sort, setSort] = useAtom(linkSortAtom)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const { me } = useAccount({
    root: { todos: [] }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    setDraggingId(active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = me?.root.todos.findIndex(
        (item) => item?.id === active.id
      )
      const newIndex = me?.root.todos.findIndex((item) => item?.id === over?.id)

      if (oldIndex !== undefined && newIndex !== undefined) {
        me?.root.todos.splice(newIndex, 0, me.root.todos.splice(oldIndex, 1)[0])
        // Update sequences
        me?.root.todos.forEach((todo, index) => {
          if (todo) {
            todo.sequence = index
          }
        })
      }
    }
  }

  const toggleCheck = (index: number) => {
    const todo = me?.root.todos[index]
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  let sortedTodos =
    sort === "title" && me?.root.todos
      ? [...me?.root.todos].sort((a, b) =>
          (a?.title || "").localeCompare(b?.title || "")
        )
      : me?.root.todos
  sortedTodos = sortedTodos || []

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedTodos.map((item) => item?.id || "") || []}
        strategy={verticalListSortingStrategy}
      >
        <ul role="list" className="divide-y divide-primary/5">
          {sortedTodos.map(
            (todoItem, index) =>
              todoItem && (
                <SortableItem
                  key={`todo-${todoItem.id}-${todoItem.title}`}
                  todoItem={todoItem}
                  index={index}
                  onCheck={toggleCheck}
                  disabled={sort !== "manual"}
                />
              )
          )}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

const SortableItem: React.FC<SortableItemProps> = ({
  todoItem,
  index,
  onCheck,
  disabled = false
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative py-3 hover:bg-muted/40"
    >
      <div className="flex justify-between gap-x-6 px-6 max-lg:px-4">
        <div className="flex min-w-0 gap-x-4">
          {todoItem.isLink && todoItem.meta ? (
            <Image
              src={todoItem.meta.favicon}
              alt={todoItem.title}
              className="size-5 rounded-full"
              width={16}
              height={16}
            />
          ) : (
            <Checkbox
              checked={todoItem.completed}
              onCheckedChange={() => onCheck(index)}
            />
          )}
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold text-primary/80 hover:text-primary">
              {todoItem.isLink && todoItem.meta ? (
                <Link
                  href={todoItem.meta.url}
                  passHref
                  prefetch={false}
                  target="_blank"
                >
                  <span className="absolute inset-x-0 -top-px bottom-0"></span>
                  {todoItem.title}
                </Link>
              ) : (
                todoItem.title
              )}
            </p>
          </div>
        </div>

        {todoItem.isLink && (
          <div className="flex shrink-0 items-center gap-x-4">
            <LinkIcon
              aria-hidden="true"
              className="size-4 flex-none text-primary/40"
            />
          </div>
        )}
      </div>
    </li>
  )
}
