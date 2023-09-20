import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    // TODO: use SST to upload a passed in image to S3
    // get URL, then save the URL to the user object
  }
}
