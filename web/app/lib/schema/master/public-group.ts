import { co, CoMap, Group } from "jazz-tools"
import { ListOfForceGraphs } from "./force-graph"
import { ListOfTopics } from "./topic"

export class PublicGlobalGroupRoot extends CoMap {
  forceGraphs = co.ref(ListOfForceGraphs)
  topics = co.ref(ListOfTopics)
}

export class PublicGlobalGroup extends Group {
  root = co.ref(PublicGlobalGroupRoot)
}
