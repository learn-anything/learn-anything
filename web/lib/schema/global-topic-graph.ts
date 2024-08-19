import { co, CoList, CoMap, Group } from "jazz-tools"
export class TopicConnection extends CoMap {
	name = co.string
}
export class ListOfTopicConnections extends CoList.Of(co.ref(TopicConnection)) {}
export class TopicGraphNode extends CoMap {
	name = co.string
	prettyName = co.string
	connections = co.optional.ref(ListOfTopicConnections)
}

export class ListOfTopicGraphNodes extends CoList.Of(co.ref(TopicGraphNode)) {}

export class PublicGlobalGroupRoot extends CoMap {
	topicGraph = co.optional.ref(ListOfTopicGraphNodes)
}
export class PublicGlobalGroup extends Group {
	root = co.ref(PublicGlobalGroupRoot)
}
