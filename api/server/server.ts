import { serve } from "@hono/node-server"
import dotenv from "dotenv"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { type z } from "zod"
import { getUserIdByName } from "~/edgedb/crud/user"
import { basicAuth } from "hono/basic-auth"

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

// Return global topic content
app.post("/global-topic", async (context) => {
  const params = await context.req.json()
  const topic = params.topic
  let userId = await getUserIdByName("nikiv")
  console.log(userId)
  return context.json({ name: ".." })
  // const userId = await getUserIdByName(params.user)
  // const topic = await getTopic(params.topic, userId)
  // return context.json({
  //   name: topic[0].name,
  //   content: topic[0].content,
  //   prettyName: topic[0].prettyName,
  //   notes: topic[0].notes,
  //   links: topic[0].links,
  // })
})

// Return a list of all global topics (for use in search)
app.get("/global-topics", async (context) => {
  // return context.json({
  //   name: topic[0].name,
  //   content: topic[0].content,
  //   prettyName: topic[0].prettyName,
  //   notes: topic[0].notes,
  //   links: topic[0].links,
  // })
})

app.post("/user-topic", async (context) => {
  const params = await context.req.json()
  const topic = params.topic
  return context.json({ name: ".." })
  // const userId = await getUserIdByName(params.user)
  // const topic = await getTopic(params.topic, userId)
  // return context.json({
  //   name: topic[0].name,
  //   content: topic[0].content,
  //   prettyName: topic[0].prettyName,
  //   notes: topic[0].notes,
  //   links: topic[0].links,
  // })
})

// return topic sidebar for a user
app.post("/topic-sidebar", async (context) => {
  const params = await context.req.json()
  // const userId = await getUserIdByName(params.user)
  // const sidebar = await getSidebar(userId)
  // return context.json(idebar)
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
