import { co, CoList, CoMap, Encoders } from "jazz-tools"
import { Link, Topic } from "./master/topic"

class BaseModel extends CoMap {
  createdAt = co.encoded(Encoders.Date)
  updatedAt = co.encoded(Encoders.Date)
}

export class PersonalLink extends BaseModel {
  url = co.string
  icon = co.optional.string // is an icon URL
  link = co.optional.ref(Link)
  title = co.string
  slug = co.string
  description = co.optional.string
  completed = co.boolean
  sequence = co.number
  learningState = co.optional.literal("wantToLearn", "learning", "learned")
  notes = co.optional.string
  summary = co.optional.string
  topic = co.optional.ref(Topic)
}

export class PersonalLinkLists extends CoList.Of(co.ref(PersonalLink)) {}
