import { icons } from "lucide-react"

export type LearningStateValue = "wantToLearn" | "learning" | "learned"
export type LearningState = {
	label: string
<<<<<<< HEAD
	value: string
=======
	value: LearningStateValue
>>>>>>> 7c68b66b7a987fc9b616fcc1d7581056ec630058
	icon: keyof typeof icons
	className: string
}

export const LEARNING_STATES: LearningState[] = [
	{ label: "To Learn", value: "wantToLearn", icon: "Bookmark", className: "text-foreground" },
	{ label: "Learning", value: "learning", icon: "GraduationCap", className: "text-[#D29752]" },
	{ label: "Learned", value: "learned", icon: "Check", className: "text-[#708F51]" }
] as const
