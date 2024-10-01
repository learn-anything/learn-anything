// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ListOfTasks, Task } from "@/lib/schema/tasks"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useAccount } from "@/lib/providers/jazz-provider"
// import { LaIcon } from "@/components/custom/la-icon"
// import { Checkbox } from "@/components/ui/checkbox"
// import { format } from "date-fns"
// import { DatePicker } from "@/components/ui/date-picker"

// interface TaskFormProps {
// 	filter?: "today" | "upcoming"
// }

// export const TaskForm: React.FC<TaskFormProps> = ({ filter }) => {
// 	const [title, setTitle] = useState("")
// 	const [dueDate, setDueDate] = useState<Date | undefined>(filter === "today" ? new Date() : undefined)
// 	const [inputVisible, setInputVisible] = useState(false)
// 	const { me } = useAccount({ root: {} })
// 	const inputRef = useRef<HTMLInputElement>(null)

// 	const handleSubmit = (e: React.FormEvent) => {
// 		e.preventDefault()
// 		if (title.trim() && (filter !== "upcoming" || dueDate)) {
// 			if (me?.root?.tasks === undefined) {
// 				if (!me) return
// 				me.root.tasks = ListOfTasks.create([], { owner: me })
// 			}

// 			const newTask = Task.create(
// 				{
// 					title,
// 					description: "",
// 					status: "todo",
// 					createdAt: new Date(),
// 					updatedAt: new Date(),
// 					dueDate: dueDate || null
// 				},
// 				{ owner: me._owner }
// 			)
// 			me.root.tasks?.push(newTask)
// 			resetForm()
// 		}
// 	}

// 	const resetForm = () => {
// 		setTitle("")
// 		setDueDate(filter === "today" ? new Date() : undefined)
// 		setInputVisible(false)
// 	}

// 	const handleKeyDown = (e: React.KeyboardEvent) => {
// 		if (e.key === "Escape") {
// 			resetForm()
// 		} else if (e.key === "Backspace" && title.trim() === "") {
// 			resetForm()
// 		}
// 	}

// 	useEffect(() => {
// 		if (inputVisible && inputRef.current) {
// 			inputRef.current.focus()
// 		}
// 	}, [inputVisible])

// 	const formattedDate = dueDate ? format(dueDate, "EEE, MMMM do, yyyy") : "Select a date"

// 	return (
// 		<div className="flex items-center space-x-2">
// 			<AnimatePresence mode="wait">
// 				{!inputVisible ? (
// 					<motion.div
// 						key="add-button"
// 						initial={{ opacity: 0, width: 0 }}
// 						animate={{ opacity: 1, width: "auto" }}
// 						exit={{ opacity: 0, width: 0 }}
// 						transition={{ duration: 0.3 }}
// 					>
// 						<Button
// 							className="flex flex-row items-center gap-1"
// 							onClick={() => setInputVisible(true)}
// 							variant="outline"
// 						>
// 							<LaIcon name="Plus" />
// 							Add task
// 						</Button>
// 					</motion.div>
// 				) : (
// 					<motion.form
// 						key="input-form"
// 						initial={{ width: 0, opacity: 0 }}
// 						animate={{ width: "100%", opacity: 1 }}
// 						exit={{ width: 0, opacity: 0 }}
// 						transition={{ duration: 0.3 }}
// 						onSubmit={handleSubmit}
// 						className="bg-result flex w-full items-center justify-between rounded-lg p-2 px-3"
// 					>
// 						<div className="flex flex-row items-center gap-3">
// 							<Checkbox checked={false} onCheckedChange={() => {}} />
// 							<Input
// 								autoFocus
// 								ref={inputRef}
// 								value={title}
// 								className="flex-grow border-none bg-transparent p-0 focus-visible:ring-0"
// 								onChange={e => setTitle(e.target.value)}
// 								onKeyDown={handleKeyDown}
// 								placeholder="Task title"
// 							/>
// 						</div>
// 						<div className="flex items-center space-x-2">
// 							{filter === "upcoming" && (
// 								<DatePicker date={dueDate} onDateChange={(date: Date | undefined) => setDueDate(date)} />
// 							)}
// 							<span className="text-muted-foreground text-xs">{formattedDate}</span>
// 						</div>
// 					</motion.form>
// 				)}
// 			</AnimatePresence>
// 		</div>
// 	)
// }

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ListOfTasks, Task } from "@/lib/schema/tasks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

interface TaskFormProps {
	filter?: "today" | "upcoming" | undefined
}

export const TaskForm: React.FC<TaskFormProps> = ({ filter }) => {
	const [title, setTitle] = useState("")
	const [dueDate, setDueDate] = useState<Date | undefined>(filter === "today" ? new Date() : undefined)
	const [inputVisible, setInputVisible] = useState(false)
	const { me } = useAccount({ root: {} })
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (title.trim() && (filter === "today" || (filter === "upcoming" && dueDate))) {
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
					dueDate: dueDate || (filter === "today" ? new Date() : null)
				},
				{ owner: me._owner }
			)
			me.root.tasks?.push(newTask)
			resetForm()
		}
	}

	const resetForm = () => {
		setTitle("")
		setDueDate(filter === "today" ? new Date() : undefined)
		setInputVisible(false)
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

	const formattedDate = dueDate ? format(dueDate, "EEE, MMMM do, yyyy") : "Select a date"

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
							transition={{ duration: 0.3 }}
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
						<motion.form
							key="input-form"
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: "100%", opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							onSubmit={handleSubmit}
							className="bg-result flex w-full items-center justify-between rounded-lg p-2 px-3"
						>
							<div className="flex flex-row items-center gap-3">
								<Checkbox checked={false} onCheckedChange={() => {}} />
								<Input
									autoFocus
									ref={inputRef}
									value={title}
									className="flex-grow border-none bg-transparent p-0 focus-visible:ring-0"
									onChange={e => setTitle(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Task title"
								/>
							</div>
							<div className="flex items-center space-x-2">
								{filter === "upcoming" && (
									<DatePicker date={dueDate} onDateChange={(date: Date | undefined) => setDueDate(date)} />
								)}
								<span className="text-muted-foreground text-xs">{formattedDate}</span>
							</div>
						</motion.form>
					)
				) : null}
			</AnimatePresence>
		</div>
	)
}
