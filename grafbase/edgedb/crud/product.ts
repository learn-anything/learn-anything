import { client } from "../client"
import e from "../dbschema/edgeql-js"

export type Product = {
  name: string
  description: string | null
  imageUrl: string | null
  websiteUrl: string | null
  priceInUsdCents?: number
}

export async function createProduct(hankoId: string, product: Product) {
  return await e
    .insert(e.Product, {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      websiteUrl: product.websiteUrl,
      priceInUsdCents: product.priceInUsdCents
    })
    .run(client)
}

// export async function getProduct(hankoId: string, productName: string) {
//   return await e
//     .select(e.Product, (p) => {
//       filter: e.op(p.name, "=", productName)
//     })
//     .run(client)
// }
