import { Mobius } from "graphql-mobius"

const typeDefs = `
    type A {
        A: String!
        B: String!
    }

    type Query {
        Hello(word: String!): A!
    }
`

const mobius = new Mobius<typeof typeDefs>({
  // Using Mobius default fetch client
  url: "https://api.saltyaom.com/graphql",
})

// This is also fine, if you don't care about TypeDefs being available on client-side
// const mobius2 = new Mobius({
//     url: 'https://api.saltyaom.com/graphql'
//     typeDefs
// })

// Call query to execute query
const result = await mobius.query({
  Hello: {
    where: {
      word: "Hi",
    },
    select: {
      A: true,
    },
  },
})

// result
//     .then(x => x?.Hello.A)
//     .then(console.log)
