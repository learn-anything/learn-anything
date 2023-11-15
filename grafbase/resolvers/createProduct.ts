import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { createProduct } from "../edgedb/crud/product"
import { hankoIdFromToken } from "../lib/hanko-validate"

const createProductResolver: Resolver["Mutation.createProduct"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      // @ts-ignore
      await createProduct(hankoId, args)
      return "ok"
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default createProductResolver
