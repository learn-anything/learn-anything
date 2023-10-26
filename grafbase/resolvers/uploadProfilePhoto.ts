import { Context } from "@grafbase/sdk"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO: complete
export default async function uploadProfilePhotoResolver(
  root: any,
  args: { imageInBase64: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    // TODO: upload a passed in image to R2
  }
}
