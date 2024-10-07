import { co, CoList, CoMap } from "jazz-tools"

export class Link extends CoMap {
  title = co.string
  url = co.string
}

export class ListOfLinks extends CoList.Of(co.ref(Link)) {}

export class Section extends CoMap {
  title = co.string
  links = co.ref(ListOfLinks)
}

export class ListOfSections extends CoList.Of(co.ref(Section)) {}

export class LatestGlobalGuide extends CoMap {
  sections = co.ref(ListOfSections)
}

export class TopicConnection extends CoMap {
  name = co.string
}

export class ListOfTopicConnections extends CoList.Of(
  co.ref(TopicConnection),
) {}

export class Topic extends CoMap {
  name = co.string
  prettyName = co.string
  latestGlobalGuide = co.ref(LatestGlobalGuide)
}

export class ListOfTopics extends CoList.Of(co.ref(Topic)) {}
