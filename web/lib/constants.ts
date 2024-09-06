import { ID } from "jazz-tools"
import { icons } from "lucide-react"
import { PublicGlobalGroup } from "./schema/master/public-group"

export type LearningStateValue = "wantToLearn" | "learning" | "learned"
export type LearningState = {
	label: string
	value: LearningStateValue
	icon: keyof typeof icons
	className: string
}

export const LEARNING_STATES: LearningState[] = [
	{ label: "To Learn", value: "wantToLearn", icon: "Bookmark", className: "text-foreground" },
	{ label: "Learning", value: "learning", icon: "GraduationCap", className: "text-[#D29752]" },
	{ label: "Learned", value: "learned", icon: "Check", className: "text-[#708F51]" }
] as const

export const JAZZ_GLOBAL_GROUP_ID = process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>
