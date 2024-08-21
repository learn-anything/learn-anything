import { co, CoList, CoMap, Group } from "jazz-tools"
export class TopicConnection extends CoMap {
	name = co.string
}
export class ListOfTopicConnections extends CoList.Of(co.ref(TopicConnection)) {}
export class GlobalTopic extends CoMap {
	name = co.string
	prettyName = co.string
	connections = co.optional.ref(ListOfTopicConnections)
}

export class ListOfGlobalTopics extends CoList.Of(co.ref(GlobalTopic)) {}

export class PublicGlobalGroupRoot extends CoMap {
	topics = co.optional.ref(ListOfGlobalTopics)
}
export class PublicGlobalGroup extends Group {
	root = co.ref(PublicGlobalGroupRoot)
}
