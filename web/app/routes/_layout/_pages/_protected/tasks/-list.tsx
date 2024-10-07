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
