export type PersonalLinkType = {
  title: string
  url: string
  description: string
  note: string
  status: "Learning" | "Learned" | "To Learn"
  topic: string
  date: string
  dateAdded: string
}

export type TodoItem = {
  text: string
  done: boolean
}

export type User = {
  name: string
  username: string
  website: string
  bio: string
}
