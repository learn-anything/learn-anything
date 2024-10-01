import { co, CoList, CoMap, Encoders } from "jazz-tools"

export class Task extends CoMap {
	title = co.string
	description = co.optional.string
	status = co.literal("todo", "in_progress", "done")
	createdAt = co.encoded(Encoders.Date)
	updatedAt = co.encoded(Encoders.Date)
	dueDate = co.optional.encoded(Encoders.Date)
}

export class ListOfTasks extends CoList.Of(co.ref(Task)) {}
