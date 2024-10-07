import { co, CoList, CoMap } from "jazz-tools"

export class Connection extends CoMap {
  name = co.string
}

export class ListOfConnections extends CoList.Of(co.ref(Connection)) {}

export class ForceGraph extends CoMap {
  name = co.string
  prettyName = co.string
  connections = co.optional.ref(ListOfConnections)
}

export class ListOfForceGraphs extends CoList.Of(co.ref(ForceGraph)) {}
