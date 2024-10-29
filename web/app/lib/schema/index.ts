import { CoMap, co, Account, Profile } from "jazz-tools"
import { PersonalPageLists } from "./personal-page"
import { PersonalLinkLists } from "./personal-link"
import { ListOfTopics } from "./master/topic"
import { ListOfTasks } from "./task"
import { JournalEntryLists } from "./journal"
import { FolderLists, ImageLists } from "./folder"

declare module "jazz-tools" {
  interface Profile {
    avatarUrl?: string
  }
}

export class UserRoot extends CoMap {
  version = co.optional.number
  name = co.string
  username = co.string
  avatar = co.optional.string
  website = co.optional.string
  bio = co.optional.string
  is_public = co.optional.boolean
  subscription_tier = co.optional.literal("free", "premium")

  personalLinks = co.ref(PersonalLinkLists)
  personalPages = co.ref(PersonalPageLists)

  topicsWantToLearn = co.ref(ListOfTopics)
  topicsLearning = co.ref(ListOfTopics)
  topicsLearned = co.ref(ListOfTopics)

  tasks = co.ref(ListOfTasks)
  journalEntries = co.ref(JournalEntryLists)

  folders = co.ref(FolderLists)
  images = co.ref(ImageLists)
}

export class LaAccount extends Account {
  profile = co.ref(Profile)
  root = co.ref(UserRoot)

  migrate(
    this: LaAccount,
    creationProps?: { name: string; avatarUrl?: string },
  ) {
    super.migrate(creationProps)

    if (!this._refs.root && creationProps) {
      this.root = UserRoot.create(
        {
          name: creationProps.name,
          username: creationProps.name,
          avatar: creationProps.avatarUrl || "",
          website: "",
          bio: "",
          is_public: false,

          personalLinks: PersonalLinkLists.create([], { owner: this }),
          personalPages: PersonalPageLists.create([], { owner: this }),

          topicsWantToLearn: ListOfTopics.create([], { owner: this }),
          topicsLearning: ListOfTopics.create([], { owner: this }),
          topicsLearned: ListOfTopics.create([], { owner: this }),

          tasks: ListOfTasks.create([], { owner: this }),
          journalEntries: JournalEntryLists.create([], { owner: this }),

          folders: FolderLists.create([], { owner: this }),
          images: ImageLists.create([], { owner: this }),

          version: 1,
        },
        { owner: this },
      )
    }
  }
}

export * from "./master/topic"
export * from "./personal-link"
export * from "./personal-page"
export * from "./task"
export * from "./journal"
export * from "./folder"
