import { createEffect, onMount } from "solid-js"
import { useWiki } from "../GlobalContext/wiki"

export default function Editor() {
  const wiki = useWiki()
  createEffect(() => {
    console.log(wiki, "wiki")
  })
  return <div>editor</div>
}
