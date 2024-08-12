import { co, CoList, CoMap, Group } from "jazz-tools"

// for now there can only be one connection per node
export class TopicGraphNode extends CoMap {
	name = co.string
	prettyName = co.string
	connectedTopics = co.ref(ListOfTopicGraphNodes)
}

export class ListOfTopicGraphNodes extends CoList.Of(co.ref(TopicGraphNode)) {}

export class GlobalTopicGraph extends ListOfTopicGraphNodes {}

export class PublicGlobalGroupRoot extends CoMap {
	topicGraph? = co.optional.ref(GlobalTopicGraph)
}
export class PublicGlobalGroup extends Group {
	root = co.ref(PublicGlobalGroupRoot)
}
