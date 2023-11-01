import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Product, createProduct } from "../edgedb/crud/product"

export default async function createProductResolver(
  root: any,
  args: Product,
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      await createProduct(hankoId, args)
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
