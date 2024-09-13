import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { LaIcon } from "./la-icon"

interface Question {
	id: string
	title: string
	author: string
	timestamp: string
}

interface QuestionListProps {
	topicName: string
	onSelectQuestion: (question: Question) => void
}

export function QuestionList({ topicName, onSelectQuestion }: QuestionListProps) {
	const [questions, setQuestions] = useState<Question[]>([])

	useEffect(() => {
		const mockQuestions: Question[] = [
			{
				id: "1",
				title: "What's Figma's policy for customers in Russia and Belarus?",
				author: "Kote",
				timestamp: "12:30"
			},
			{
				id: "2",
				title: "What can I do offline in Figma?",
				author: "Ana",
				timestamp: "13:35"
			}
		]
		setQuestions(mockQuestions)
	}, [topicName])

	return (
		<div className="flex h-full flex-col">
			<div className="flex-grow overflow-y-auto">
				{questions.map(question => (
					<div
						key={question.id}
						className="flex cursor-pointer flex-col gap-2 rounded p-4"
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
				<Input className="bg-input focus:ring-none py-5 pr-10" placeholder="Ask new question..." />
				<button className="absolute right-2 top-1/2 -translate-y-1/2 transform opacity-60 hover:opacity-80">
					<LaIcon name="Send" />
				</button>
			</div>
		</div>
	)
}
