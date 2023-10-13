// types to be shared between grafbase and edgedb crud functions code
// TODO: possibly can be improved
// especially would be nice to have a way to define these types
// and also use them in website/ front end code
// maybe in app/ too etc.
// need turbo repo or nx or something for this?

// type GlobalLink = {
//   id: string
//   title: string
//   url: string
//   year?: string | null
// }
// type LatestGlobalGuide = {
//   summary: string
//   sections: Section[]
// }

type Section = {
  title: string
  linkIds: string[]
  summary?: string
}
export type GlobalTopic = {
  name: string
  prettyName: string
  topicSummary: string
  sections: Section[]
  // topicPath?: string
  // latestGlobalGuide?: LatestGlobalGuide
  // links?: GlobalLink[]
}
