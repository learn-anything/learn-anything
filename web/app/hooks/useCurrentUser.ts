import getCurrentUser from "app/users/queries/getCurrentUser"
import { useQuery, useSession } from "blitz"

export const useCurrentUser = () => {
  // We wouldn't have to useSession() here, but doing so improves perf on initial
  // load since we cn skip the getCurrentUser() request.
  const session = useSession()
  const [user] = useQuery(getCurrentUser, null, { enabled: !!session.userId })
  return session.userId ? user : null
}
