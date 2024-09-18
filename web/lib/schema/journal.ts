import { co, CoList, CoMap, Encoders } from "jazz-tools"

export class JournalEntry extends CoMap {
	title = co.string
	content = co.json()
	date = co.encoded(Encoders.Date)
	createdAt = co.encoded(Encoders.Date)
	updatedAt = co.encoded(Encoders.Date)
}

export class JournalEntryLists extends CoList.Of(co.ref(JournalEntry)) {}
