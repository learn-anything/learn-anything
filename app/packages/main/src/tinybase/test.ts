import { setupTinybaseStore } from "./tinybase"
import { seedWikiSync } from "./wiki"

async function main() {
  const persister = await setupTinybaseStore()
  seedWikiSync("nikita", persister)
}

main()
