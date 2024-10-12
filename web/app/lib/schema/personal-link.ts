import { co, CoList } from "jazz-tools"
import { Link, Topic } from "./master/topic"
import { BaseModel } from "./base"

export class PersonalLink extends BaseModel {
  url = co.string
  icon = co.optional.string
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
