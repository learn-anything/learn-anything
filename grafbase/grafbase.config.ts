import { g, config, auth } from "@grafbase/sdk"

const provider = auth.JWKS({
  issuer: g.env("HANKO_API_ENDPOINT"),
})

export default config({
  schema: g,
  auth: {
    providers: [provider],
    rules: (rules) => {
      rules.private()
      // TODO: add public rules?
    },
  },
})

// TODO: annoying having to do this manually, should be inferred
// https://discord.com/channels/890534438151274507/932953009380528168/1123641234091671613
const topic = g.type("Topic", {
  title: g.string(),
})

// get topics for a given user
g.query("getTopics", {
  args: { topicName: g.string().optional() },
  returns: g.ref(topic),
  resolver: "topics/get",
})

// TODO: waiting on grafbase how to do this in ts
// .auth((rules) => {
//   rules.public()
// })
