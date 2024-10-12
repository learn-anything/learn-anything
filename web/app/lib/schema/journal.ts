import { co, CoList, Encoders } from "jazz-tools"
import { BaseModel } from "./base"

export class JournalEntry extends BaseModel {
  title = co.string
  content = co.json()
  date = co.encoded(Encoders.Date)
}

export class JournalEntryLists extends CoList.Of(co.ref(JournalEntry)) {}
