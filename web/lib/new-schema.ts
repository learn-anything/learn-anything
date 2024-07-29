import { CoMap, CoList, co, Account, Group } from "jazz-tools"

/*
 * TOPIC
 */
export class Topic extends CoMap {
  name = co.string
  description = co.string
  isDefault = co.boolean
}

export class TopicList extends CoList.Of(co.ref(Topic)) {}

export class MasterData extends CoMap {
  topics = co.ref(TopicList)

  static async initialize(group: Group): Promise<MasterData> {
    const topicList = TopicList.create([], { owner: group })
    const masterData = MasterData.create(
      { topics: topicList },
      { owner: group }
    )

    const defaultTopics = [
      {
        name: "JavaScript",
        description: "A programming language",
        isDefault: true
      },
      {
        name: "Python",
        description: "A versatile programming language",
        isDefault: true
      },
      {
        name: "React",
        description: "A JavaScript library for building user interfaces",
        isDefault: true
      }
    ]

    for (const topicData of defaultTopics) {
      const topic = Topic.create(topicData, { owner: group })
      topicList.push(topic)
    }

    masterData.topics = topicList
    return masterData
  }
}

export class UserLink extends CoMap {
  url = co.string
  title = co.string
  image? = co.string as co<string | null>
  favicon = co.string
  description? = co.string as co<string | null>
}

export class Todo extends CoMap {
  title = co.string
  description? = co.string as co<string | null>
  topic? = co.ref(Topic) as co<Topic | null>
  completed = co.boolean
  sequence = co.number
  isLink = co.boolean
  meta? = co.ref(UserLink)
}

class TodoList extends CoList.Of(co.ref(Todo)) {}

class UserProfile extends CoMap {
  name = co.string
}

export class UserRoot extends CoMap {
  name = co.string
  username = co.string
  website = co.string
  bio = co.string
  todos = co.ref(TodoList)
  topics = co.ref(TopicList)
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
          todos: TodoList.create([], { owner: this }),
          topics: TopicList.create([], { owner: this })
        },
        { owner: this }
      )
    }
  }
}
