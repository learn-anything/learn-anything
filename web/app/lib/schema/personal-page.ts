import { co, CoList } from "jazz-tools"
import { Topic } from "./master/topic"
import { BaseModel } from "./base"

export class PersonalPage extends BaseModel {
  title = co.optional.string
  slug = co.optional.string
  public = co.boolean
  content = co.optional.json()
  topic = co.optional.ref(Topic)
}

export class PersonalPageLists extends CoList.Of(co.ref(PersonalPage)) {}
