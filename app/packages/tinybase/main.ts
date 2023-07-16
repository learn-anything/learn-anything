import { setupTinybaseStore } from "./tinybase"
import { seedWikiSync } from "./wiki"

async function main() {
  setupTinybaseStore()
  // seedWikiSync("nikita")
}

main()
