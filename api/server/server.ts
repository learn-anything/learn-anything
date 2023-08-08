import { serve } from "@hono/node-server"
import dotenv from "dotenv"
import { getSidebar, getTopic } from "grafbase/db/topic"
import { getUserIdByName } from "grafbase/db/user"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { type z } from "zod"

dotenv.config()

export const app = new Hono()

app.onError((err, ctx) => {
  if ("format" in err) {
    console.error(JSON.stringify((err as z.ZodError).format(), undefined, 2))
  } else {
    console.error(err)
  }
  return ctx.json({ error: "Internal Server Error" }, 500)
})

app.use("*", cors())

// return public content/notes/links for a topic of a user
app.post("/topic", async (context) => {
  const params = await context.req.json()
  const userId = await getUserIdByName(params.user)
  const topic = await getTopic(params.topic, userId)
  return context.json({
    name: topic[0].name,
    content: topic[0].content,
    prettyName: topic[0].prettyName,
    notes: topic[0].notes,
    links: topic[0].links,
  })
})

// return topic sidebar for a user
app.post("/topic-sidebar", async (context) => {
  const params = await context.req.json()
  const userId = await getUserIdByName(params.user)
  const sidebar = await getSidebar(userId)
  return context.json(sidebar)
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
