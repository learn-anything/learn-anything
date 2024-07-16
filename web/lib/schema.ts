import { CoMap, co } from "jazz-tools"

export class Issue extends CoMap {
  title = co.string
  description = co.string
  estimate = co.number
  status? = co.literal("backlog", "in progress", "done")
}
