"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLinkIcon, Trash2Icon } from "lucide-react"
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
import { ListOfPersonalTodoItems, TodoItem } from "@/lib/schema"
import { useAtom, useAtomValue } from "jotai"
import { linkEditIdAtom, linkSortAtom } from "@/store/link"
import { cn } from "@/lib/utils"
import { CreateForm } from "./form/manage"
import { useKey } from "react-use"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@omit/react-confirm-dialog"

interface SortableItemProps {
  todoItem: TodoItem
  disabled?: boolean
  isFocused: boolean
  setFocusedId: (id: string | null) => void
  registerRef: (id: string, ref: HTMLLIElement | null) => void
  onDelete?: (todoItem: TodoItem) => void
}

export const LinkList = () => {
  const { me } = useAccount({
    root: { todos: [] }
  })
  const todos = me?.root.todos || []

  const isEditing = useAtomValue(linkEditIdAtom)
  const [sort] = useAtom(linkSortAtom)
  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  const todoRefs = React.useRef<{ [key: string]: HTMLLIElement | null }>({})

  let sortedTodos =
    sort === "title" && todos
      ? [...todos].sort((a, b) =>
          (a?.title || "").localeCompare(b?.title || "")
        )
      : todos
  sortedTodos = sortedTodos || []

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

  const registerRef = React.useCallback(
    (id: string, ref: HTMLLIElement | null) => {
      todoRefs.current[id] = ref
    },
    []
  )

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!me?.root?.todos || sortedTodos.length === 0 || isEditing) return

      const currentIndex = sortedTodos.findIndex(
        (todo) => todo?.id === focusedId
      )

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault()
        const newIndex =
          e.key === "ArrowUp"
            ? Math.max(0, currentIndex - 1)
            : Math.min(sortedTodos.length - 1, currentIndex + 1)

        if (e.metaKey && sort === "manual") {
          const currentTodo = me.root.todos[currentIndex]
          if (!currentTodo) return

          // Create a copy of the todos array
          const todosArray = [...me.root.todos]

          // Use arrayMove on the copy
          const newTodos = arrayMove(todosArray, currentIndex, newIndex)

          // Clear the original list
          while (me.root.todos.length > 0) {
            me.root.todos.pop()
          }

          // Add items back to the original list
          newTodos.forEach((todo) => {
            if (todo) {
              me.root.todos.push(todo)
            }
          })

          // Update sequences
          updateSequences(me.root.todos)

          const newFocusedTodo = me.root.todos[newIndex]
          if (newFocusedTodo) {
            setFocusedId(newFocusedTodo.id)

            requestAnimationFrame(() => {
              todoRefs.current[newFocusedTodo.id]?.focus()
            })
          }
        } else {
          const newFocusedTodo = sortedTodos[newIndex]
          if (newFocusedTodo) {
            setFocusedId(newFocusedTodo.id)
            requestAnimationFrame(() => {
              todoRefs.current[newFocusedTodo.id]?.focus()
            })
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [me?.root?.todos, focusedId, isEditing, sort])

  const updateSequences = (todos: ListOfPersonalTodoItems) => {
    todos.forEach((todo, index) => {
      if (todo) {
        todo.sequence = index
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!active || !over || !me?.root?.todos) {
      console.error("Drag operation fail", { active, over })
      return
    }

    const oldIndex = me.root.todos.findIndex((item) => item?.id === active.id)
    const newIndex = me.root.todos.findIndex((item) => item?.id === over.id)

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
        // Create a copy of the array
        const todosArray = [...me.root.todos]

        // Use arrayMove on the copy
        const updatedTodos = arrayMove(todosArray, oldIndex, newIndex)

        // Clear the original list
        while (me.root.todos.length > 0) {
          me.root.todos.pop()
        }

        // Add items one by one to the original list
        updatedTodos.forEach((todo) => {
          if (todo) {
            me.root.todos.push(todo)
          }
        })

        updateSequences(me.root.todos)
      } catch (error) {
        console.error("Error during todo reordering:", error)
      }
    }
  }

  const handleDelete = (todoItem: TodoItem) => {
    if (!me?.root?.todos) return

    const index = me.root.todos.findIndex((item) => item?.id === todoItem.id)
    if (index === -1) {
      console.error("Delete operation fail", { index, todoItem })
      return
    }

    me.root.todos.splice(index, 1)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
                  key={todoItem.id}
                  todoItem={todoItem}
                  disabled={sort !== "manual"}
                  registerRef={registerRef}
                  isFocused={focusedId === todoItem.id}
                  setFocusedId={setFocusedId}
                  onDelete={handleDelete}
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
  disabled = false,
  isFocused,
  setFocusedId,
  registerRef,
  onDelete
}) => {
  const confirm = useConfirm()
  const [editId, setEditId] = useAtom(linkEditIdAtom)
  const isEditing = editId === todoItem.id
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id, disabled })
  const formRef = React.useRef<HTMLFormElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  React.useEffect(() => {
    if (isEditing) {
      formRef.current?.focus()
    }
  }, [isEditing])

  const refCallback = React.useCallback(
    (node: HTMLLIElement | null) => {
      setNodeRef(node)
      registerRef(todoItem.id, node)
    },
    [setNodeRef, registerRef, todoItem.id]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditId(todoItem.id)
    }
  }

  useKey("Escape", () => {
    if (isEditing) {
      handleCancel()
    }
  })

  const handleSuccess = () => {
    setEditId(null)
  }

  const handleCancel = () => {
    setEditId(null)
  }

  const handleDelete = async (e: React.MouseEvent, todoItem: TodoItem) => {
    e.stopPropagation()

    const result = await confirm({
      title: `Delete "${todoItem.title}"?`,
      description: "This action cannot be undone.",
      alertDialogTitle: {
        className: "text-base"
      },
      customActions: (onConfirm, onCancel) => (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </>
      )
    })

    if (result) {
      console.log("Deleting todo item", todoItem)
      onDelete?.(todoItem)
    }
  }

  if (isEditing) {
    return (
      <CreateForm
        ref={formRef}
        todoItem={todoItem}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <li
      ref={refCallback}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={0}
      onFocus={() => setFocusedId(todoItem.id)}
      onBlur={() => setFocusedId(null)}
      onKeyDown={handleKeyDown}
      className={cn("relative py-3 outline-none hover:bg-muted/40", {
        "bg-muted/40": isFocused,
        "cursor-move": !disabled
      })}
      onClick={() => setEditId(todoItem.id)}
    >
      <div className="flex justify-between gap-x-6 px-6 max-lg:px-4">
        <div className="flex min-w-0 gap-x-4">
          <Checkbox
            checked={todoItem.completed}
            onCheckedChange={() => {
              todoItem.completed = !todoItem.completed
            }}
          />
          {todoItem.isLink && todoItem.meta && (
            <Image
              src={todoItem.meta.favicon}
              alt={todoItem.title}
              className="size-5 rounded-full"
              width={16}
              height={16}
            />
          )}
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold text-primary/80 hover:text-primary">
              {todoItem.title}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-x-4">
          {todoItem.isLink && todoItem.meta && (
            <Link
              href={todoItem.meta.url}
              passHref
              prefetch={false}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <ExternalLinkIcon
                aria-hidden="true"
                className="size-4 flex-none text-primary/50 hover:text-primary"
              />
            </Link>
          )}
          <Button
            size="icon"
            className="h-auto w-auto bg-transparent text-destructive hover:bg-transparent hover:text-red-500"
            onClick={(e) => handleDelete(e, todoItem)}
          >
            <Trash2Icon size={16} />
          </Button>
        </div>
      </div>
    </li>
  )
}