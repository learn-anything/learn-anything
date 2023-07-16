import { setupTinybaseStore } from "./tinybase"
import { seedWikiSync } from "./wiki"

async function main() {
  const store = setupTinybaseStore()
  // seedWikiSync("nikita")
}

main()
