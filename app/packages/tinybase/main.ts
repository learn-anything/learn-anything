import { setupTinybaseStore } from "./tinybase"
import { seedWikiSync } from "./wiki"

async function main() {
  const store = await setupTinybaseStore()
  seedWikiSync("nikita", store)
}

main()
