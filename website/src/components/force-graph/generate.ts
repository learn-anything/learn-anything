import { Graph } from "@nothing-but/force-graph"
import { Num } from "@nothing-but/utils"

export type RawData = {
  name: string
  prettyName: string
  connections: string[]
}

export type NodesData = {
  nodes: Graph.Node[]
  edges: Graph.Edge[]
  getLabel(node: Graph.Node): string
}

export function generateNodesFromData(raw_data: RawData[]): NodesData {
  const nodes_map = new Map<string, Graph.Node>()
  const prettyName_map = new Map<string, string>()
  const edges: Graph.Edge[] = []

  for (const data of raw_data) {
    const node = Graph.makeNode(data.name)
    nodes_map.set(data.name, node)
    prettyName_map.set(data.name, data.prettyName)
  }

  for (const data of raw_data) {
    const node_a = nodes_map.get(data.name)!
    for (const name_b of data.connections) {
      const node_b = nodes_map.get(name_b)!
      const edge = Graph.connect(node_a, node_b)
      edges.push(edge)
    }
  }

  const nodes = Array.from(nodes_map.values())

  return {
    nodes,
    edges,
    getLabel: (node) => prettyName_map.get(node.key as string)!
  }
}

export function generateInitialGraph(length: number = 256): NodesData {
  const nodes: Graph.Node[] = Array.from({ length }, Graph.makeNode)
  const edges: Graph.Edge[] = []

  for (let i = 0; i < length; i++) {
    const node = nodes[i]!

    if (node.edges.length > 0 && Math.random() < 0.8) continue

    const b_index = Num.random_int(length)
    let node_b = nodes[b_index]!

    if (node_b === node) {
      node_b = nodes[(b_index + 1) % length]!
    }

    edges.push(Graph.connect(node, node_b))
  }

  return {
    nodes,
    edges,
    getLabel: (node) => String(node.key)
  }
}
