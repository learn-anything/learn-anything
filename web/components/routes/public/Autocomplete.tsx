import React, { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import { cn, searchSafeRegExp, shuffleArray } from "@/lib/utils"
import { useMountedState } from "react-use"

interface GraphNode {
	name: string
	prettyName: string
	connectedTopics: string[]
}

interface AutocompleteProps {
	topics: GraphNode[]
	onSelect: (topic: string) => void
	onInputChange: (value: string) => void
}

export function Autocomplete({ topics = [], onSelect, onInputChange }: AutocompleteProps): JSX.Element {
	const inputRef = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)
	const isMounted = useMountedState()
	const [inputValue, setInputValue] = useState("")
	const [hasInteracted, setHasInteracted] = useState(false)
	const [showDropdown, setShowDropdown] = useState(false)

	const initialShuffledTopics = useMemo(() => shuffleArray(topics).slice(0, 5), [topics])

	const filteredTopics = useMemo(() => {
		if (!inputValue) {
			return initialShuffledTopics
		}

		const regex = searchSafeRegExp(inputValue)
		return topics
			.filter(
				topic =>
					regex.test(topic.name) ||
					regex.test(topic.prettyName) ||
					topic.connectedTopics.some(connectedTopic => regex.test(connectedTopic))
			)
			.sort((a, b) => a.prettyName.localeCompare(b.prettyName))
			.slice(0, 10)
	}, [inputValue, topics, initialShuffledTopics])

	const handleSelect = useCallback(
		(topic: GraphNode) => {
			setOpen(false)
			onSelect(topic.name)
		},
		[onSelect]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setInputValue(value)
			setShowDropdown(true)
			setHasInteracted(true)
			onInputChange(value)
		},
		[onInputChange]
	)

	const handleFocus = useCallback(() => {
		setHasInteracted(true)
	}, [])

	const handleClick = useCallback(() => {
		setShowDropdown(true)
		setHasInteracted(true)
	}, [])

	const commandKey = useMemo(() => {
		return filteredTopics
			.map(topic => `${topic.name}:${topic.prettyName}:${topic.connectedTopics.join(",")}`)
			.join("__")
	}, [filteredTopics])

	useEffect(() => {
		if (inputRef.current && isMounted() && hasInteracted) {
			inputRef.current.focus()
		}
	}, [commandKey, isMounted, hasInteracted])

	const animationProps = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
		transition: { duration: 0.1 }
	}

	return (
		<Command
			className={cn("relative mx-auto max-w-md overflow-visible shadow-md", {
				"rounded-lg border": !showDropdown,
				"rounded-none rounded-t-lg border-l border-r border-t": showDropdown
			})}
		>
			<div className={"relative flex items-center px-2 py-3"}>
				<CommandPrimitive.Input
					ref={inputRef}
					value={inputValue}
					onValueChange={handleInputChange}
					onBlur={() => {
						setTimeout(() => setShowDropdown(false), 100)
					}}
					onFocus={handleFocus}
					onClick={handleClick}
					placeholder={filteredTopics[0]?.prettyName}
					className={cn("placeholder:text-muted-foreground flex-1 bg-transparent px-2 outline-none")}
					autoFocus // Add this line
				/>
			</div>
			<div className="relative">
				<AnimatePresence>
					{showDropdown && hasInteracted && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.1 }}
							className="bg-background absolute left-0 right-0 z-10 -mx-px rounded-b-lg border-b border-l border-r border-t shadow-lg"
						>
							<CommandList className="max-h-56">
								<CommandGroup className="my-2">
									{filteredTopics.map((topic, index) => (
										<CommandItem
											key={index}
											value={topic.name}
											onSelect={() => handleSelect(topic)}
											className="min-h-10 rounded-none px-3 py-1.5"
										>
											<span>{topic.prettyName}</span>
											<span className="text-muted-foreground/80 ml-auto text-xs">
												{topic.connectedTopics.length > 0 && topic.connectedTopics.join(", ")}
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
