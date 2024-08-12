import { co, CoList, CoMap } from "jazz-tools"

// for now there can only be one connection per node
export class TopicGraphNode extends CoMap {
	name = co.string
	prettyName = co.string
	connectedTopicName? = co.string
}

export class GlobalTopicGraph extends CoList.Of(co.ref(TopicGraphNode)) {}
