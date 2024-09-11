"use client"

import React, { useState } from "react"
import { Task } from "@/lib/schema/tasks"
import { Input } from "@/components/ui/input"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"

interface TaskFormProps {
	onAddTask: (task: Task) => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
	const [title, setTitle] = useState("")
	const { me } = useAccount()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (title.trim() && me) {
			const newTask = Task.create(
				{
					title,
					description: "",
					status: "todo",
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{ owner: me._owner }
			)
			onAddTask(newTask)
			setTitle("")
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex space-x-2">
			<Input value={title} className="w-[50%]" onChange={e => setTitle(e.target.value)} placeholder="Add new task" />
			<button className="bg-inherit" type="submit">
				<LaIcon name="CirclePlus" className="size-6" />
			</button>
		</form>
	)
}
