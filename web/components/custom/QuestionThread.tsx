import { useState, useEffect } from "react"
import { LaIcon } from "./la-icon"
import { Input } from "../ui/input"

interface Answer {
	id: string
	author: string
	content: string
	timestamp: string
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

	useEffect(() => {
		const mockAnswers: Answer[] = [
			{
				id: "1",
				author: "Kote",
				content: "u can bla bla bla.",
				timestamp: "4 sept 2023"
			}
		]
		setAnswers(mockAnswers)
	}, [question.id])

	const sendAnswer = (e: React.FormEvent) => {
		e.preventDefault()
		if (newAnswer.trim()) {
			setNewAnswer("")
		}
	}

	return (
		<div className="border-accent bg-background fixed bottom-0 right-0 top-0 z-50 flex h-full w-[40%] flex-col border-l">
			<div className="border-accent flex w-full justify-between border-b p-4">
				<div className="flex w-full flex-col">
					<div className="mb-2 flex w-full items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-result h-8 w-8 rounded-full"></div>
							<h2 className="opacity-70">{question.author}</h2>
						</div>
						<button className="bg-accent rounded-full p-1.5 opacity-50 hover:opacity-80" onClick={onClose}>
							<LaIcon name="X" className="text-primary" />
						</button>
					</div>
					<p className="text-md mb-1 font-semibold">{question.title}</p>
					<p className="text-sm opacity-70">{question.timestamp}</p>
				</div>
			</div>

			<div className="flex-grow overflow-y-auto p-4">
				{answers.map(answer => (
					<div key={answer.id} className="mb-4">
						<p>{answer.content}</p>
						<p className="mt-1 text-sm opacity-70">
							{answer.author} • {answer.timestamp}
						</p>
					</div>
				))}
			</div>
			<div className="border-accent border-t p-4">
				<form className="relative" onSubmit={sendAnswer}>
					<input
						type="text"
						value={newAnswer}
						onChange={e => setNewAnswer(e.target.value)}
						placeholder="Answer the question..."
						className="bg-input w-full rounded p-2 text-opacity-70 focus:outline-none focus:ring-0"
					/>
					<button className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600">
						<LaIcon name="Send" />
					</button>
				</form>
			</div>
		</div>
	)
}
