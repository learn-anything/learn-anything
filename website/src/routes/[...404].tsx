import { onMount } from "solid-js"
import { useNavigate } from "solid-start"

export default function NotFound() {
  const navigate = useNavigate()
  onMount(() => {
    navigate("/")
  })
  return <></>
}
