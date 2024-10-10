import { ID } from "jazz-tools"
import { icons } from "lucide-react"
import { PublicGlobalGroup } from "./schema/master/public-group"
import { getEnvVariable } from "./utils"
import Graph from "@/data/graph.json"

export type LearningStateValue = "wantToLearn" | "learning" | "learned"
export type LearningState = {
  label: string
  value: LearningStateValue
  icon: keyof typeof icons
  className: string
}
export interface GraphNode {
  name: string
  prettyName: string
  connectedTopics: string[]
}

export const LEARNING_STATES: LearningState[] = [
  {
    label: "To Learn",
    value: "wantToLearn",
    icon: "Bookmark",
    className: "text-foreground",
  },
  {
    label: "Learning",
    value: "learning",
    icon: "GraduationCap",
    className: "text-yellow-600 hover:text-yellow-700",
  },
  {
    label: "Learned",
    value: "learned",
    icon: "Check",
    className: "text-green-700 hover:text-green-800",
  },
] as const

export const JAZZ_GLOBAL_GROUP_ID = getEnvVariable(
  "VITE_JAZZ_GLOBAL_GROUP_ID",
) as ID<PublicGlobalGroup>

export const GraphData = Graph as GraphNode[]
