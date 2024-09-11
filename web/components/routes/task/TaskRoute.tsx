"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
import { Task } from "@/lib/schema/tasks"
import { TaskList } from "./TaskList"
import { TaskForm } from "./TaskForm"

export const TaskRoute: React.FC = () => {
	const { me } = useAccount({ root: { tasks: [] } })
	const tasks = me?.root?.tasks || []

	const addTask = (newTask: Task) => {
		if (me?.root?.tasks) {
			me.root.tasks.push(newTask)
		}
	}

	const updateTask = (taskId: string, updates: Partial<Task>) => {
		if (me?.root?.tasks) {
			const taskIndex = me.root.tasks.findIndex(task => task?.id === taskId)
			if (taskIndex !== -1) {
				Object.assign(me.root.tasks[taskIndex]!, updates)
			}
		}
	}

	return (
		<div className="flex flex-col space-y-4 p-4">
			<h1 className="text-2xl font-bold">Tasks</h1>
			<TaskForm onAddTask={addTask} />
			<TaskList tasks={tasks as Task[]} updateTask={updateTask} />
		</div>
	)
}