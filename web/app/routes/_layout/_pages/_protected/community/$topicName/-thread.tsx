import { useState, useEffect, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LaIcon } from "~/components/custom/la-icon"
interface Answer {
  id: string
  author: string
  content: string
  timestamp: string
  replies?: Answer[]
}

interface QuestionThreadProps {
  question: {
    id: string
    title: string
    author: string
    timestamp: string
  }
  onClose: () => void
}

export function QuestionThread({ question, onClose }: QuestionThreadProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState("")
  const [replyTo, setReplyTo] = useState<Answer | null>(null)
  const [replyToAuthor, setReplyToAuthor] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const mockAnswers: Answer[] = [
      {
        id: "1",
        author: "Noone",
        content:
          "Just press Command + Just press Command + Just press Command + Just press Command + Just press Command +",
        timestamp: "14:40",
      },
    ]
    setAnswers(mockAnswers)
  }, [question.id])

  const sendReply = (answer: Answer) => {
    setReplyTo(answer)
    setReplyToAuthor(answer.author)
    setNewAnswer(`@${answer.author} `)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        const length = inputRef.current.value.length
        inputRef.current.setSelectionRange(length, length)
      }
    }, 0)
  }

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setNewAnswer(newValue)

    if (replyToAuthor && !newValue.startsWith(`@${replyToAuthor}`)) {
      setReplyTo(null)
      setReplyToAuthor(null)
    }
  }

  const sendAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAnswer.trim()) {
      const newReply: Answer = {
        id: Date.now().toString(),
        author: "Me",
        content: newAnswer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      if (replyTo) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer.id === replyTo.id
              ? { ...answer, replies: [...(answer.replies || []), newReply] }
              : answer,
          ),
        )
      } else {
        setAnswers((prevAnswers) => [...prevAnswers, newReply])
      }
      setNewAnswer("")
      setReplyTo(null)
      setReplyToAuthor(null)
    }
  }

  const renderAnswers = (answers: Answer[], isReply = false) => (
    <div>
      {answers.map((answer) => (
        <div
          key={answer.id}
          className={`flex-grow overflow-y-auto p-4 ${isReply ? "ml-3 border-l" : ""}`}
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6 rounded-full bg-accent"></div>
              <span className="text-sm">{answer.author}</span>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <LaIcon
                      name="Ellipsis"
                      className="mr-2 size-4 shrink-0 opacity-30 hover:opacity-70"
                    />
                  </button>
                </DropdownMenuTrigger>
                <div className="w-[15px]">
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => sendReply(answer)}>
                      <div className="mx-auto flex flex-row items-center gap-3">
                        <LaIcon name="Reply" className="size-4 shrink-0" />
                        Reply
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>
              <span className="text-sm opacity-30">{answer.timestamp}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="">{answer.content}</p>
            <LaIcon
              name="ThumbsUp"
              className="ml-2 size-4 shrink-0 opacity-70"
            />
          </div>
          {answer.replies && renderAnswers(answer.replies, true)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-[40%] flex-col border-l border-accent bg-background">
      <div className="flex w-full justify-between border-b border-accent p-4">
        <div className="flex w-full flex-col">
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent"></div>
              <h2 className="opacity-70">{question.author}</h2>
            </div>
            <button
              className="rounded-full bg-accent p-1.5 opacity-50 hover:opacity-80"
              onClick={onClose}
            >
              <LaIcon name="X" className="text-primary" />
            </button>
          </div>
          <p className="text-md mb-1 font-semibold">{question.title}</p>
          <p className="text-sm opacity-70">{question.timestamp}</p>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">{renderAnswers(answers)}</div>
      <div className="border-t border-accent p-4">
        <form className="relative" onSubmit={sendAnswer}>
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={newAnswer}
              onChange={changeInput}
              placeholder="Answer the question..."
              className="w-full rounded bg-input p-2 text-opacity-70 placeholder:text-opacity-50 focus:outline-none focus:ring-0"
            />
          </div>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 transform opacity-50 hover:opacity-90">
            <LaIcon name="Send" />
          </button>
        </form>
      </div>
    </div>
  )
}
