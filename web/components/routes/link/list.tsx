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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { useAccount } from "@/lib/providers/jazz-provider"
import { ListOfPersonalTodoItems, TodoItem } from "@/lib/schema"
import { useAtom } from "jotai"
import { linkEditIdAtom, linkSortAtom } from "@/store/link"
import { useKey } from "react-use"
import { useConfirm } from "@omit/react-confirm-dialog"
import { ListItem } from "./list-item"
import { useRef, useState, useCallback, useEffect } from "react"

const LinkList = () => {
  const confirm = useConfirm()
  const { me } = useAccount({
    root: { todos: [] }
  })
  const todos = me?.root?.todos || []

  const [editId, setEditId] = useAtom(linkEditIdAtom)
  const [open, setOpen] = useState(true)
  const [sort] = useAtom(linkSortAtom)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const todoRefs = useRef<{ [key: string]: HTMLLIElement | null }>({})

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

  const overlayClick = () => {
    setEditId(null)
  }

  const registerRef = useCallback((id: string, ref: HTMLLIElement | null) => {
    todoRefs.current[id] = ref
  }, [])

  useKey("Escape", () => {
    if (editId) {
      setEditId(null)
    }
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!me?.root?.todos || sortedTodos.length === 0 || editId !== null)
        return

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

          const todosArray = [...me.root.todos]
          const newTodos = arrayMove(todosArray, currentIndex, newIndex)

          while (me.root.todos.length > 0) {
            me.root.todos.pop()
          }

          newTodos.forEach((todo) => {
            if (todo) {
              me.root.todos.push(todo)
            }
          })

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
  }, [me?.root?.todos, sortedTodos, focusedId, editId, sort])

  const updateSequences = (todos: ListOfPersonalTodoItems) => {
    todos.forEach((todo, index) => {
      if (todo) {
        todo.sequence = index
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
        const todosArray = [...me.root.todos]
        const updatedTodos = arrayMove(todosArray, oldIndex, newIndex)

        while (me.root.todos.length > 0) {
          me.root.todos.pop()
        }

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

    setDraggingId(null)
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
    <>
      {editId && <div className="fixed inset-0 z-40" onClick={overlayClick} />}
      <div className="relative z-50">
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
                (todoItem) =>
                  todoItem && (
                    <ListItem
                      key={todoItem.id}
                      confirm={confirm}
                      isEditing={editId === todoItem.id}
                      setEditId={setEditId}
                      todoItem={todoItem}
                      disabled={sort !== "manual" || editId !== null}
                      registerRef={registerRef}
                      isDragging={draggingId === todoItem.id}
                      isFocused={focusedId === todoItem.id}
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
