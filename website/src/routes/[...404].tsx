import { onMount } from "solid-js"
import { useNavigate } from "solid-start"

export default function NotFound() {
  const navigate = useNavigate()
  onMount(() => {
    console.log("why 404")
    // navigate("/")
  })
  return <></>
}
