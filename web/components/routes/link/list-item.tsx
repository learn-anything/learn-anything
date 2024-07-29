"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLinkIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TodoItem } from "@/lib/schema"
import { cn } from "@/lib/utils"
import { CreateForm } from "./form/manage"
import { Button } from "@/components/ui/button"
import { ConfirmOptions } from "@omit/react-confirm-dialog"

interface ListItemProps {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  todoItem: TodoItem
  disabled?: boolean
  isEditing: boolean
  setEditId: (id: string | null) => void
  isDragging: boolean
  isFocused: boolean
  setFocusedId: (id: string | null) => void
  registerRef: (id: string, ref: HTMLLIElement | null) => void
  onDelete?: (todoItem: TodoItem) => void
}

export const ListItem: React.FC<ListItemProps> = ({
  confirm,
  isEditing,
  setEditId,
  todoItem,
  disabled = false,
  isDragging,
  isFocused,
  setFocusedId,
  registerRef,
  onDelete
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todoItem.id, disabled })
  const formRef = React.useRef<HTMLFormElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isDragging ? "none" : "auto"
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

  const handleSuccess = () => {
    setEditId(null)
  }

  const handleCancel = () => {
    setEditId(null)
  }

  const handleRowClick = () => {
    console.log("Row clicked", todoItem.id)
    setEditId(todoItem.id)
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
      style={style as React.CSSProperties}
      {...attributes}
      {...listeners}
      tabIndex={0}
      onFocus={() => setFocusedId(todoItem.id)}
      onBlur={() => setFocusedId(null)}
      onKeyDown={handleKeyDown}
      className={cn("relative py-3 outline-none hover:bg-muted/40", {
        "bg-muted/40": isFocused
        // "cursor-move": !disabled
      })}
      onClick={handleRowClick}
    >
      <div className="flex justify-between gap-x-6 px-6 max-lg:px-4">
        <div className="flex min-w-0 gap-x-4">
          <Checkbox
            checked={todoItem.completed}
            onClick={(e) => e.stopPropagation()}
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
          <div className="min-w-0 flex-auto cursor-auto">
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
