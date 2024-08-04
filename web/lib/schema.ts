import { CoMap, CoList, co, Account, Group, Encoders } from "jazz-tools"
import { nullable, nullableJson } from "./types"

// PersonalPage is page of content that user can write to. Similar to Notion/Reflect page. It holds ProseMirror editor content + metadata.
// if public, certain members (can do read/write access accordingly), personal (end to end encrypted, only accessed by user)
// TODO: how to do optional/required fields
export class PersonalPage extends CoMap {
  content = co.string // TODO: ask anselm how to best hold editor state of ProseMirror editor (required)
  publicName = co.string // optional (learn-anything.xyz/@user/publicName)
  // TODO: add backlinks (PersonalPages linking to this page)
  globalMainTopic = co.optional.ref(GlobalTopic)
}
// GlobalLink is a link with unique URL that holds some useful metadata. Can be used to do queries like `most popular links added by users` etc.
export class GlobalLink extends CoMap {
  url = co.string // unique TODO: should be enforced https://discord.com/channels/1139617727565271160/1139621689882321009/1269637368789340342
  websiteDown = co.boolean // if website is 404 or down
  dateAdded = co.encoded(Encoders.Date)
}
export class PersonalLink extends CoMap {
  note = co.string
  type = co.literal("personalLink")
  globalLink = co.ref(GlobalLink)
}
export class GlobalTopic extends CoMap {
  name = co.string
}
class ListOfGlobalTopics extends CoList.Of(co.ref(GlobalTopic)) {}
class Section extends CoMap {
  title = co.string
  links = co.ref(ListOfGlobalLinks)
}
class ListOfSections extends CoList.Of(co.ref(() => Section)) {}
export class Page extends CoMap {
  title = co.string
  content = nullableJson()
}
export class UserLink extends CoMap {
  url = co.string
  title = co.string
  image = nullable(co.string)
  favicon = co.string
  description = nullable(co.string)
}
export class TodoItem extends CoMap {
  title = co.string
  description = nullable(co.string)
  topic? = co.ref(GlobalTopic)
  completed = co.boolean
  sequence = co.number
  isLink = co.boolean
  meta? = co.ref(UserLink)
}
export class ListOfPersonalTodoItems extends CoList.Of(co.ref(TodoItem)) {}
class ListOfGlobalLinks extends CoList.Of(co.ref(GlobalLink)) {}
class ListOfPersonalLinks extends CoList.Of(co.ref(PersonalLink)) {}
class ListOfPages extends CoList.Of(co.ref(Page)) {}
class ListOfTopics extends CoList.Of(co.ref(GlobalTopic)) {}
class UserProfile extends CoMap {
  name = co.string
  // TODO: avatar
}
export class UserRoot extends CoMap {
  name = co.string
  username = co.string
  website = co.string
  bio = co.string
  todos = co.ref(ListOfPersonalTodoItems)

  // not implemented yet
  topicsWantToLearn = co.ref(ListOfTopics)
  topicsLearning = co.ref(ListOfTopics)
  topicsLearned = co.ref(ListOfTopics)
  personalLinks = co.ref(ListOfPersonalLinks)
  pages = co.ref(ListOfPages)
}
export class LaAccount extends Account {
  profile = co.ref(UserProfile)
  root = co.ref(UserRoot)
  async migrate(
    this: LaAccount,
    creationProps?:
      | { name: string; username: string; website: string; bio: string }
      | undefined
  ): Promise<void> {
    if (!this._refs.root && creationProps) {
      const profileGroup = Group.create({ owner: this })
      profileGroup.addMember("everyone", "reader")
      this.profile = UserProfile.create(
        { name: creationProps.name },
        { owner: profileGroup }
      )
      this.root = UserRoot.create(
        {
          name: creationProps.name,
          username: creationProps.username,
          website: creationProps.website,
          bio: creationProps.bio,
          todos: ListOfPersonalTodoItems.create([], { owner: this }),
          // not implemented yet
          topicsWantToLearn: ListOfTopics.create([], { owner: this }),
          topicsLearning: ListOfTopics.create([], { owner: this }),
          topicsLearned: ListOfTopics.create([], { owner: this }),
          personalLinks: ListOfPersonalLinks.create([], { owner: this }),
          pages: ListOfPages.create([], { owner: this })
        },
        { owner: this }
      )
    }
  }
}
