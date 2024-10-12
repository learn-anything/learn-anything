import { co, CoList, Encoders } from "jazz-tools"
import { BaseModel } from "./base"

export class Task extends BaseModel {
  title = co.string
  description = co.optional.string
  status = co.literal("todo", "in_progress", "done")
  dueDate = co.optional.encoded(Encoders.Date)
}

export class ListOfTasks extends CoList.Of(co.ref(Task)) {}
