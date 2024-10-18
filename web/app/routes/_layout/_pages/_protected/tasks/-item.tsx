import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { useState, useRef, useEffect } from "react"
import { Task } from "~/lib/schema/task"

interface TaskItemProps {
  task: Task
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const statusChange = (checked: boolean) => {
    if (checked) {
      onDeleteTask(task.id)
    } else {
      onUpdateTask(task.id, { status: "todo" })
    }
  }

  const clickTitle = () => {
    setIsEditing(true)
  }

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
  }

  const titleBlur = () => {
    setIsEditing(false)
    if (editedTitle.trim() !== task.title) {
      onUpdateTask(task.id, { title: editedTitle.trim() })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      titleBlur()
    }
  }

  const formattedDate = task.dueDate
    ? format(new Date(task.dueDate), "EEE, MMMM do, yyyy")
    : "No due date"

  return (
    <li className="transitiion-opacity flex items-center justify-between rounded-lg bg-result p-2 px-3 hover:opacity-60">
      <div className="flex flex-grow flex-row items-center gap-3">
        <Checkbox
          checked={task.status === "done"}
          onCheckedChange={statusChange}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            value={editedTitle}
            onChange={titleChange}
            onBlur={titleBlur}
            onKeyDown={handleKeyDown}
            className="flex-grow border-none bg-transparent p-0 shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        ) : (
          <p
            className={
              task.status === "done"
                ? "flex-grow text-foreground line-through"
                : "flex-grow"
            }
            onClick={clickTitle}
          >
            {task.title}
          </p>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{formattedDate}</span>
    </li>
  )
}
