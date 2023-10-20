async function main() {
  const currentFilePath = new URL(import.meta.url).pathname
  const connectionsFilePath = `${currentFilePath.replace(
    "loadConnectionsIntoGrafbase.ts",
    ""
  )}connections.json`
  const file = Bun.file(connectionsFilePath)
  const fileContent = await file.text()
  const obj = JSON.parse(fileContent)
  let topicsWithConnections = JSON.stringify(obj, null, 2)
  // Replace quotes around property names
  topicsWithConnections = topicsWithConnections.replace(/"([^"]+)":/g, "$1:")

  const query = `
  mutation UpdateGrafbaseKv($topicsWithConnections: [updateGrafbaseKvOutput!]!) {
    updateGrafbaseKv(topicsWithConnections: $topicsWithConnections)
  }
`

  const variables = {
    topicsWithConnections: obj.map((topic: any) => ({
      name: topic.name,
      prettyName: topic.prettyName,
      connections: topic.connections
    }))
  }

  const res = await fetch(process.env.GRAFBASE_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GRAFBASE_INTERNAL_SECRET!}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).catch((err) => {
    console.log(err, "err")
  })
  console.log("done")
}

await main()
