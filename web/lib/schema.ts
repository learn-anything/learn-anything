import { CoMap, CoList, co, Account, Group } from "jazz-tools"

export class PersonalLink extends CoMap {
  note = co.string
  type = co.literal("personalLink")
  globalLink = co.ref(GlobalLink)
}

export class GlobalLink extends CoMap {
  url = co.string // unique
}

class GlobalTopic extends CoMap {
  name = co.string
  title = co.string
  sections = co.ref(ListOfSections)
  connections = co.ref(ListOfGlobalTopics)
}
class ListOfGlobalTopics extends CoList.Of(co.ref(GlobalTopic)) {}

class Section extends CoMap {
  title = co.string
  links = co.ref(ListOfGlobalLinks)
}
class ListOfSections extends CoList.Of(co.ref(() => Section)) {}

// TODO: not used until jazz supports rich text
export class Page extends CoMap {
  title = co.string
  // TODO: make rich text
  content = co.string
}

export class TodoItem extends CoMap {
  type = co.literal("todo")
  text = co.string
  done = co.boolean
}

class ListOfGlobalLinks extends CoList.Of(co.ref(GlobalLink)) {}
class ListOfPersonalLinks extends CoList.Of(co.ref(PersonalLink)) {}
class ListOfPersonalTodoItems extends CoList.Of(co.ref(TodoItem)) {}
class ListOfPages extends CoList.Of(co.ref(Page)) {}
class ListOfTopics extends CoList.Of(co.ref(GlobalTopic)) {}
class UserProfile extends CoMap {
  name = co.string
  // TODO: avatar
}
class UserRoot extends CoMap {
  topicsWantToLearn = co.ref(ListOfTopics)
  topicsLearning = co.ref(ListOfTopics)
  topicsLearned = co.ref(ListOfTopics)
  personalLinks = co.ref(ListOfPersonalLinks)
  pages = co.ref(ListOfPages)
  todos = co.ref(ListOfPersonalTodoItems)
  name = co.string
  username = co.string
  website = co.string
  bio = co.string
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
          topicsWantToLearn: ListOfTopics.create([], { owner: this }),
          topicsLearning: ListOfTopics.create([], { owner: this }),
          topicsLearned: ListOfTopics.create([], { owner: this }),
          personalLinks: ListOfPersonalLinks.create([], { owner: this }),
          pages: ListOfPages.create([], { owner: this }),
          todos: ListOfPersonalTodoItems.create([], { owner: this }),
          name: creationProps.name,
          username: creationProps.username,
          website: creationProps.website,
          bio: creationProps.bio
        },
        { owner: this }
      )
    }
  }
}
