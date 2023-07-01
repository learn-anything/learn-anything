import { Hono } from "hono"
import { cors } from "hono/cors"
import { type z } from "zod"
import { serve } from "@hono/node-server"
import { addUser, getUserIdByName } from "grafbase/db/user"
import { getTopic, getTopicCount } from "grafbase/db/topic"
import * as edgedb from "edgedb"
import dotenv from "dotenv"
import { forceWikiSync } from "grafbase/db/sync/wiki"

dotenv.config()

export const app = new Hono()
export const client = edgedb.createClient()

app.onError((err, ctx) => {
  if ("format" in err) {
    console.error(JSON.stringify((err as z.ZodError).format(), undefined, 2))
  } else {
    console.error(err)
  }
  return ctx.json({ error: "Internal Server Error" }, 500)
})

app.use("*", cors())

app.get("/topic", async (ctx) => {
  const userId = await getUserIdByName("Nikita")
  const res = await getTopic("Physics", userId)
  return ctx.json({
    name: res[0].name,
    content: res[0].content,
  })
})

app.get("/sidebar", async (ctx) => {
  return ctx.json({
    topics: [
      "Analytics",
      "Analytics/Grafana",
      "Analytics/Tinybird",
      "Animals",
      "Animals/Birds",
      "API",
      "API/tRPC",
    ],
  })
})

async function main() {
  serve(app)
    .listen(3000)
    .once("listening", () => {
      console.log("🚀 Server started on port 3000")
    })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
