// NOTE: what it should send learn-anything://open-in-desktop/login?email=email@gmail.com&token=M1BFT5
// sends this now: learn-anything://open-in-desktop/login?hankoToken=M1BFT5

import { getHankoCookie } from "@la/shared/lib"
import { onMount } from "solid-js"
import { useNavigate } from "solid-start"

export default function DesktopLogin() {
  const navigate = useNavigate()

  onMount(async () => {
    const cookieToken = getHankoCookie()
    if (cookieToken) {
      const url = `learn-anything://open-in-desktop/login?hankoToken=${cookieToken}`
      window.open(url, "_blank")
      navigate("/")
    } else {
      localStorage.setItem("pageBeforeSignIn", location.pathname)
      navigate("/auth")
    }
  })
  return <></>
}
