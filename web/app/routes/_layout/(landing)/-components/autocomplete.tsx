import * as React from "react"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import { cn, searchSafeRegExp, shuffleArray } from "@/lib/utils"
import { useIsMounted } from "@/hooks/use-is-mounted"

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

export function Autocomplete({
  topics = [],
  onSelect,
  onInputChange,
}: AutocompleteProps): JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const isMounted = useIsMounted()
  const [inputValue, setInputValue] = React.useState("")
  const [hasInteracted, setHasInteracted] = React.useState(false)

  const [initialTopics, setInitialTopics] = React.useState<GraphNode[]>([])

  React.useEffect(() => {
    setInitialTopics(shuffleArray(topics).slice(0, 5))
  }, [topics])

  const filteredTopics = React.useMemo(() => {
    if (!inputValue) {
      return initialTopics
    }

    const regex = searchSafeRegExp(inputValue)
    return topics
      .filter(
        (topic) =>
          regex.test(topic.name) ||
          regex.test(topic.prettyName) ||
          topic.connectedTopics.some((connectedTopic) =>
            regex.test(connectedTopic),
          ),
      )
      .sort((a, b) => a.prettyName.localeCompare(b.prettyName))
      .slice(0, 10)
  }, [inputValue, topics, initialTopics])

  const handleSelect = React.useCallback(
    (topic: GraphNode) => {
      setOpen(false)
      onSelect(topic.name)
    },
    [onSelect],
  )

  const handleInputChange = React.useCallback(
    (value: string) => {
      setInputValue(value)
      setOpen(true)
      setHasInteracted(true)
      onInputChange(value)
    },
    [onInputChange],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
        event.preventDefault()
        setOpen(true)
        setHasInteracted(true)
      }
    },
    [open],
  )

  const commandKey = React.useMemo(() => {
    return filteredTopics
      .map(
        (topic) =>
          `${topic.name}:${topic.prettyName}:${topic.connectedTopics.join(",")}`,
      )
      .join("__")
  }, [filteredTopics])

  React.useEffect(() => {
    if (inputRef.current && isMounted() && hasInteracted) {
      inputRef.current.focus()
    }
  }, [commandKey, isMounted, hasInteracted])

  return (
    <Command
      className={cn(
        "relative mx-auto max-w-md overflow-visible bg-background shadow-md",
        {
          "rounded-lg border": !open,
          "rounded-none rounded-t-lg border-l border-r border-t": open,
        },
      )}
    >
      <div className="relative flex items-center">
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => setOpen(false), 100)
          }}
          onFocus={() => setHasInteracted(true)}
          onClick={() => {
            setOpen(true)
            setHasInteracted(true)
          }}
          placeholder={filteredTopics[0]?.prettyName}
          className={cn(
            "min-h-10 flex-1 bg-transparent px-3 py-1 outline-none placeholder:text-muted-foreground sm:px-4 sm:py-3",
          )}
          autoFocus
        />
      </div>
      <div className="relative">
        <AnimatePresence>
          {open && hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute left-0 right-0 z-10 -mx-px rounded-b-lg border-b border-l border-r border-t bg-background shadow-lg"
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
                      <span className="ml-auto text-xs text-muted-foreground/80">
                        {topic.connectedTopics.length > 0 &&
                          topic.connectedTopics.join(", ")}
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
