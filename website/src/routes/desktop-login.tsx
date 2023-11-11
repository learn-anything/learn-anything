// NOTE: what it should send learn-anything://open-in-desktop/login?email=email@gmail.com&token=M1BFT5
// sends this now: learn-anything://open-in-desktop/login?hankoToken=M1BFT5

import { getHankoCookie } from "@la/shared/lib"
import { onMount } from "solid-js"

export default function DesktopLogin() {
  onMount(async () => {
    const cookieToken = getHankoCookie()
    const url = `learn-anything://open-in-desktop/login?hankoToken=${cookieToken}`
    window.open(url, "_blank")
  })
  return <></>
}
