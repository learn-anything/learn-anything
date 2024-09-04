"use client"

import { LEARNING_STATES } from "@/lib/constants"
import { parseAsStringLiteral, useQueryState } from "nuqs"

export const TopicLearningStateRoute: React.FC = () => {
	const [learningState, setLearningState] = useQueryState(
		"state",
		parseAsStringLiteral(LEARNING_STATES.map(ls => ls.value))
	)
	return <div>TopicLearningStateRoute</div>
}
