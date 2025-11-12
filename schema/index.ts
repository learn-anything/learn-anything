export { Account, Session } from "blade/auth/schema"
import { model, link } from "blade/schema"

// goal: links + contacts + X posts/profiles + eagle/IG clone
// images etc. store under user with posting

export const Link = model({
  slug: "link",
  fields: {
    owner: link({
      target: "account",
      required: true,
    }),
  },
})
