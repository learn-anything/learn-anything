import { useCallback } from "react"
import { toast } from "sonner"
import { LaAccount } from "@/lib/schema"
import { ID } from "jazz-tools"
import { Task } from "~/lib/schema/task"

export const useTaskActions = () => {
  const newTask = useCallback((me: LaAccount): Task | null => {
    if (!me.root) {
      console.error("User root is not initialized")
      return null
    }

    if (!me.root.tasks) {
      me.root.tasks = []
    }

    const newTask = Task.create(
      {
        title: "",
        description: "",
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { owner: me._owner },
    )

    me.root.tasks.push(newTask)
    return newTask
  }, [])

  const deleteTask = useCallback((me: LaAccount, taskId: ID<Task>): void => {
    if (!me.root?.tasks) return

    const index: number = me.root.tasks.findIndex(
      (item: Task) => item?.id === taskId,
    )
    if (index === -1) {
      toast.error("Task not found")
      return
    }

    const task = me.root.tasks[index]
    if (!task) {
      toast.error("Task data is invalid")
      return
    }

    try {
      me.root.tasks.splice(index, 1)

      toast.success("Task completed", {
        position: "bottom-right",
      })
    } catch (error) {
      console.error("Failed to delete task", error)
      toast.error("Failed to delete task")
    }
  }, [])

  return { newTask, deleteTask }
}
