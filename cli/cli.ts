// la --help or la = help
// la --safari-url = save current open safari url to la `inbox`
// la --chrome-url = save current open chrome url to la `inbox`
// la --text="some text" = save text to la `inbox`
// la --text-with-safari-url="some text" = save text to la `inbox` with safari url as metadata
// la --text-with-chrome-url="some text" = save text to la `inbox` with chrome url as metadata
// links are added as `personal link`
// TODO: all functions from CLI, should be exposed as global hotkeys or app calls potentially to desktop app
// TODO: use typed mobius client

import { createMobiusFromApiToken } from "@la/shared/lib"
import open from "open"
import { createInterface } from "readline/promises"
import fs from "fs"
import path from "path"

async function main() {
  const args = Bun.argv
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const command = args[2]
  const commandParts = command?.split("=") || []
  const commandKey = commandParts[0]

  if (process.env.API_TOKEN === undefined) {
    await rl.question(
      "API_TOKEN not set, press return to open browser to set it"
    )
    await open("http://localhost:3000/get-api-key")
    let server
    const token = await new Promise<string | null>((resolve) => {
      server = Bun.serve({
        port: 3500,
        fetch(req) {
          resolve(new URL(req.url).searchParams.get("token"))
          return new Response(
            `<link rel="icon" href="data:;base64,iVBORw0KGgo="><script>window.close()</script>`,
            { headers: { "Content-Type": "text/html" } }
          )
        }
      })
    })
    console.log(token, "token")
    rl.close()
    server!.stop()
    return ""
  }
  if (process.env.GRAFBASE_API_URL === undefined) {
    console.log(
      "GRAFBASE_API_URL not set, press return to open browser to set it"
    )
    return ""
  }
  const mobius = createMobiusFromApiToken(
    process.env.API_TOKEN,
    process.env.GRAFBASE_API_URL
  )
  console.log(mobius)

  switch (commandKey) {
    case "--safari-url": {
      const url = commandParts[1]
      break
    }
    case "--chrome-url": {
      const url = commandParts[1]
      break
    }
    case "--text": {
      const text = commandParts[1]
      break
    }
    case "--text-with-safari-url": {
      const text = commandParts[1]
      break
    }
    case "--text-with-chrome-url": {
      const text = commandParts[1]
      break
    }
    case undefined:
      console.log("No command provided")
      break
    default:
      console.log("Unknown command")
      break
  }
}

await main()

function updateEnvStore(token: string) {
  const filePath = path.join(
    process.env.HOME! || process.env.USERPROFILE!,
    ".config",
    "la",
    ".env"
  )

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, "")
    Bun.write(filePath, `token=${token}`)
  } else {
    Bun.write(filePath, `token=${token}`)
  }
}

function getTokenFromEnvStore() {
  const filePath = path.join(
    process.env.HOME! || process.env.USERPROFILE!,
    ".config",
    "la",
    ".env"
  )

  if (fs.existsSync(filePath)) {
    const envFileContent = fs.readFileSync(filePath, "utf8")
    const token = envFileContent.split("=")[1]
    return token
  } else {
    console.log("File does not exist")
    return null
  }
}

function getToken() {}
