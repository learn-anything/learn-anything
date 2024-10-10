import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ListOfTasks, Task } from "@/lib/schema/task"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "~/components/custom/date-picker"
import { useSearch } from "@tanstack/react-router"

export const TaskForm: React.FC = () => {
  const { filter } = useSearch({ from: "/_layout/_pages/_protected/tasks/" })
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    filter === "today" ? new Date() : undefined,
  )
  const [inputVisible, setInputVisible] = useState(false)
  const { me } = useAccount({ root: {} })
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const resetForm = useCallback(() => {
    setTitle("")
    setDueDate(filter === "today" ? new Date() : undefined)
    setInputVisible(false)
  }, [filter])

  const saveTask = useCallback(() => {
    if (title.trim() && (filter !== "upcoming" || dueDate)) {
      if (me?.root?.tasks === undefined) {
        if (!me) return
        me.root.tasks = ListOfTasks.create([], { owner: me })
      }

      const newTask = Task.create(
        {
          title,
          description: "",
          status: "todo",
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate:
            filter === "upcoming"
              ? dueDate
              : filter === "today"
                ? new Date()
                : null,
        },
        { owner: me._owner },
      )
      me.root.tasks?.push(newTask)
      resetForm()
    }
  }, [title, dueDate, filter, me, resetForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveTask()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      resetForm()
    } else if (e.key === "Backspace" && title.trim() === "") {
      resetForm()
    }
  }

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (title.trim()) {
          saveTask()
        } else {
          resetForm()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [title, saveTask, resetForm])

  return (
    <div className="flex items-center space-x-2">
      <AnimatePresence mode="wait">
        {filter ? (
          !inputVisible ? (
            <motion.div
              key="add-button"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.01 }}
            >
              <Button
                className="flex flex-row items-center gap-1"
                onClick={() => setInputVisible(true)}
                variant="outline"
              >
                <LaIcon name="Plus" />
                Add task
              </Button>
            </motion.div>
          ) : (
            <div
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex w-full items-center justify-between rounded-lg bg-result px-2 py-1"
            >
              <div className="flex min-w-0 flex-1 items-center">
                <Checkbox
                  checked={false}
                  onCheckedChange={() => {}}
                  className="mr-2"
                />
                <Input
                  autoFocus
                  ref={inputRef}
                  value={title}
                  className="flex-grow border-none bg-transparent p-0 focus-visible:ring-0"
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Task title"
                />
              </div>

              <div
                className="ml-2 flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {filter === "upcoming" && (
                  <DatePicker
                    date={dueDate}
                    onDateChange={(date: Date | undefined) => setDueDate(date)}
                    className="z-50"
                  />
                )}
              </div>
            </div>
          )
        ) : null}
      </AnimatePresence>
    </div>
  )
}
