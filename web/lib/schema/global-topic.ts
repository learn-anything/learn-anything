import { co, CoList, CoMap, Group } from "jazz-tools"

export class GlobalLink extends CoMap {
	name = co.string
	// TODO: make sure its unique
	url = co.string
}

export class ListOfGlobalLinks extends CoList.Of(co.ref(GlobalLink)) {}

export class Section extends CoMap {
	name = co.string
	links = co.ref(ListOfGlobalLinks)
}

export class ListOfSections extends CoList.Of(co.ref(Section)) {}

export class GlobalGuide extends CoMap {
	sections = co.ref(ListOfSections)
}
export class TopicConnection extends CoMap {
	name = co.string
}

export class ListOfTopicConnections extends CoList.Of(co.ref(TopicConnection)) {}
export class GlobalTopic extends CoMap {
	name = co.string
	prettyName = co.string
	connections = co.optional.ref(ListOfTopicConnections)
	globalGuide = co.ref(GlobalGuide)
}

export class ListOfGlobalTopics extends CoList.Of(co.ref(GlobalTopic)) {}

export class PublicGlobalGroupRoot extends CoMap {
	topics = co.optional.ref(ListOfGlobalTopics)
}
export class PublicGlobalGroup extends Group {
	root = co.ref(PublicGlobalGroupRoot)
}
