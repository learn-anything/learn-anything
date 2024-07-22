"use client"

import React, { useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { useDrag, useDrop } from "react-dnd"
import { useAccount } from "@/lib/providers/jazz-provider"
import { TodoItem } from "@/lib/schema"
import Image from "next/image"

const ItemTypes = {
  TODO_ITEM: "todoItem"
}

interface SortableItemProps {
  todoItem: TodoItem
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  toggleCheck: (index: number) => void
}

export const InboxList = () => {
  const { me, logOut } = useAccount({
    root: { todos: [] }
  })
  const todos = me?.root.todos

  if (!todos) {
    return null
  }

  console.log("test")

  const handleMoved = (dragIndex: number, hoverIndex: number) => {
    // const draggedTodo = todos[dragIndex]
    // const newTodos = [...todos]
    // newTodos.splice(dragIndex, 1)
    // newTodos.splice(hoverIndex, 0, draggedTodo)
    // // Update sequences
    // newTodos.forEach((todo, index) => {
    //   todo.sequence = index + 1
    // })
    // me.root.todos = newTodos
  }

  const toggleCheck = (index: number) => {
    // if (todos) {
    //   const todo = todos[index]
    //   if (todo) {
    //     todo.completed = !todo.completed
    //   }
    // }
  }

  return (
    <>
      <ul role="list" className="divide-y divide-primary/5">
        {todos?.map(
          (todoItem, index) =>
            todoItem && (
              <SortableItem
                key={`todo-${todoItem.id}-${todoItem.title}`}
                todoItem={todoItem}
                index={index}
                onMove={handleMoved}
                toggleCheck={toggleCheck}
              />
            )
        )}
      </ul>
    </>
  )
}

const SortableItem: React.FC<SortableItemProps> = ({
  todoItem,
  index,
  onMove,
  toggleCheck
}) => {
  console.log(todoItem)
  const ref = useRef<HTMLLIElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO_ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.TODO_ITEM,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      onMove(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    }
  })

  drag(drop(ref))

  const opacity = isDragging ? 0.5 : 1

  return (
    <li
      ref={ref}
      className="relative py-3 hover:bg-muted/40"
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="px-4">
        <div className="flex justify-between gap-x-6">
          <div className="flex min-w-0 gap-x-4">
            {todoItem.isLink && todoItem.meta ? (
              <Image
                src={todoItem.meta.favicon}
                alt={todoItem.title}
                className="size-5 rounded-md"
                width={16}
                height={16}
              />
            ) : (
              <Checkbox
                checked={todoItem.completed}
                onChange={() => toggleCheck(index)}
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
      </div>
    </li>
  )
}
