"use client"

import React, { useState, useRef, useCallback, useMemo } from "react"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import { cn, searchSafeRegExp } from "@/lib/utils"

interface GraphNode {
	name: string
	prettyName: string
	connectedTopics: string[]
}

interface AutocompleteProps {
	topics: GraphNode[]
	onSelect: (topic: GraphNode) => void
	onInputChange: (value: string) => void
}

export function Autocomplete({ topics = [], onSelect, onInputChange }: AutocompleteProps): JSX.Element {
	const inputRef = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)
	const [inputValue, setInputValue] = useState("")

	const filteredTopics = useMemo(() => {
		if (!inputValue) {
			return topics.slice(0, 5)
		}

		const regex = searchSafeRegExp(inputValue)
		return topics.filter(
			topic =>
				regex.test(topic.name) ||
				regex.test(topic.prettyName) ||
				topic.connectedTopics.some(connectedTopic => regex.test(connectedTopic))
		)
	}, [inputValue, topics])

	const handleSelect = useCallback(
		(topic: GraphNode) => {
			setInputValue(topic.prettyName)
			setOpen(false)
			onSelect(topic)
		},
		[onSelect]
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" && filteredTopics.length > 0) {
				handleSelect(filteredTopics[0])
			} else if ((e.key === "Backspace" || e.key === "Delete") && inputRef.current?.value === "") {
				setOpen(true)
			}
		},
		[filteredTopics, handleSelect]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setInputValue(value)
			setOpen(true)
			onInputChange(value)
		},
		[onInputChange]
	)

	return (
		<Command
			className={cn("bg-background relative overflow-visible", {
				"rounded-lg border": !open,
				"rounded-none rounded-t-lg border-l border-r border-t": open
			})}
			onKeyDown={handleKeyDown}
		>
			<div className="flex items-center p-2">
				<CommandPrimitive.Input
					ref={inputRef}
					value={inputValue}
					onValueChange={handleInputChange}
					onBlur={() => setTimeout(() => setOpen(false), 100)}
					onFocus={() => setOpen(true)}
					placeholder="Search for a topic..."
					className={cn("placeholder:text-muted-foreground flex-1 bg-transparent px-2 py-1 outline-none", {
						"mb-1 border-b pb-2.5": open
					})}
				/>
			</div>
			<div className="relative">
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.1 }}
							className="bg-background absolute left-0 right-0 z-10 -mx-px rounded-b-lg border-b border-l border-r shadow-lg"
						>
							<CommandList className="max-h-52">
								<CommandGroup className="mb-2">
									{filteredTopics.map(topic => (
										<CommandItem
											key={topic.name}
											onSelect={() => handleSelect(topic)}
											className="min-h-10 rounded-none px-3 py-1.5"
										>
											<span>{topic.prettyName}</span>
											<span className="text-muted-foreground ml-auto text-xs">
												{topic.connectedTopics.length > 0 ? topic.connectedTopics.join(", ") : "-"}
											</span>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Command>
	)
}

export default Autocomplete
