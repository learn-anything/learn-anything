"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Task } from "@/lib/schema/tasks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"

interface TaskFormProps {
	onAddTask: (task: Task) => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
	const [title, setTitle] = useState("")
	const [inputVisible, setInputVisible] = useState(false)
	const { me } = useAccount()
	const inputRef = useRef<HTMLInputElement>(null)

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
			resetForm()
		}
	}

	const resetForm = () => {
		setTitle("")
		setInputVisible(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			resetForm()
		}
	}

	useEffect(() => {
		if (inputVisible && inputRef.current) {
			inputRef.current.focus()
		}
	}, [inputVisible])

	return (
		<div className="flex items-center space-x-2 p-4">
			<AnimatePresence mode="wait">
				{!inputVisible ? (
					<motion.div
						key="add-button"
						initial={{ opacity: 0, width: 0 }}
						animate={{ opacity: 1, width: "auto" }}
						exit={{ opacity: 0, width: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Button onClick={() => setInputVisible(true)} variant="outline">
							Add task
						</Button>
					</motion.div>
				) : (
					<motion.form
						key="input-form"
						initial={{ width: 0, opacity: 0 }}
						animate={{ width: "60%", opacity: 1 }}
						exit={{ width: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						onSubmit={handleSubmit}
						className="flex items-center space-x-2"
					>
						<Input
							autoFocus
							ref={inputRef}
							value={title}
							className="flex-grow"
							onChange={e => setTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Enter task title"
						/>
						<Button type="button" variant="ghost" size="icon" onClick={resetForm}>
							<LaIcon name="X" className="h-4 w-4" />
						</Button>
					</motion.form>
				)}
			</AnimatePresence>
		</div>
	)
}
