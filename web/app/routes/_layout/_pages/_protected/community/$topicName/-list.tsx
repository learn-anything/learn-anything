import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "~/components/ui/input"
import { LaIcon } from "~/components/custom/la-icon"

interface Question {
  id: string
  title: string
  author: string
  timestamp: string
}

interface QuestionListProps {
  topicName: string
  onSelectQuestion: (question: Question) => void
  selectedQuestionId?: string
}

export function QuestionList({
  topicName,
  onSelectQuestion,
  selectedQuestionId,
}: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    const mockQuestions: Question[] = Array(10)
      .fill(null)
      .map((_, index) => ({
        id: (index + 1).toString(),
        title: "What can I do offline in Figma?",
        author: "Ana",
        timestamp: "13:35",
      }))
    setQuestions(mockQuestions)
  }, [topicName])

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hide flex-grow overflow-y-auto">
        {questions.map((question) => (
          <div
            key={question.id}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded p-4",
              selectedQuestionId === question.id && "bg-red-500",
            )}
            onClick={() => onSelectQuestion(question)}
          >
            <div className="flex flex-row justify-between opacity-50">
              <div className="flex flex-row items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-slate-500" />
                <p className="text-sm font-medium">{question.author}</p>
              </div>
              <p>{question.timestamp}</p>
            </div>
            <h3 className="font-medium">{question.title}</h3>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <Input
          className="bg-input py-5 pr-10 focus:outline-none focus:ring-0"
          placeholder="Ask new question..."
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 transform opacity-60 hover:opacity-80">
          <LaIcon name="Send" />
        </button>
      </div>
    </div>
  )
}
