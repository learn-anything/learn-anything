import { Task } from "~/lib/schema/task"
import { TaskItem } from "./-item"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">You have no tasks yet</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-y-2">
      {tasks?.map(
        (task) =>
          task?.id && (
            <li key={task.id}>
              <TaskItem
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            </li>
          ),
      )}
    </ul>
  )
}
