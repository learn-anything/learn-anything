import { CoMap, CoList, co, Account, Group } from "jazz-tools"
import { nullable, nullableJson } from "./types"

// TODO: pages should have same permission control as Figma
// public, certain members (read/write access later), personal (ideally end to end encrypted)
export class PersonalPage extends CoMap {
  publicName = co.string // optional (learn-anything.xyz/@user/publicName) (pretty page access)
  content = co.string // TipTap content (JSON?)
  // simple version of Notion/Reflect like editor
  // backlinks: personal pages linking to this page
  globalMainTopic = co.ref(GlobalTopic) // optional?
}

export class PersonalLink extends CoMap {
  note = co.string
  type = co.literal("personalLink")
  globalLink = co.ref(GlobalLink)
}

export class GlobalLink extends CoMap {
  url = co.string // unique
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
