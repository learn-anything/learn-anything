import { Hono } from "hono"
import { cors } from "hono/cors"
import { type z } from "zod"
import { serve } from "@hono/node-server"
import { getUserIdByName } from "grafbase/db/user"
import { getTopic } from "grafbase/db/topic"
import * as edgedb from "edgedb"

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

app.get("/topics", async (ctx) => {
  const userId = await getUserIdByName("Nikita")
  const res = await getTopic("Physics", userId)
  console.log(res)
  return ctx.json({
    name: "Physics",
    content: "",
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
