export type Wiki = {
  wikiFolderPath: string
  openTopic: Topic
  sidebarTopics: SidebarTopic[] // alphebetically sorted
  // topics: Topic[] // TODO: should this be added to store or just kept in tinybase?
}

export type SidebarTopic = {
  prettyName: string // assumed unique, used to switch openTopic on click
  indent: number // indent level
}

export type Topic = {
  topicName: string
  filePath: string
  fileContent: string
  topicContent: string
  prettyName: string
  notes: Note[]
  links: Link[]
}

export type Note = {
  content: string
  url: string
  public: boolean
}

export type Link = {
  title: string
  url: string
  public: boolean
}
