import { useNavigate } from "solid-start"
import { useUser } from "../GlobalContext/user"
import { onMount } from "solid-js"

export default function Profile() {
  const user = useUser()
  const navigate = useNavigate()

  onMount(() => {
    if (!user.user.signedIn) {
      navigate("/auth")
    }
  })

  // TODO: add ability to choose username (as member only)
  // see a list of all links/topics you've added etc.
  // essentially your user profile
  // just need to become member to claim the username too
  // members should be able to change username too, to something that's available if they want
  return <div>profile page</div>
}
