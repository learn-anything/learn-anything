import { Show } from "solid-js"
import { useWiki } from "../GlobalContext/wiki"
import Button from "./Button"
import { useUser } from "../GlobalContext/user"
// import { connectWiki } from "#preload"

export default function NoTopicChosen() {
  const wiki = useWiki()
  const user = useUser()
  return (
    <div class="flex items-center justify-center w-full h-full">
      {/* TODO: pressing 'Create wiki' will open modal with instructions */}
      {/* either connect existing folder of .md files */}
      {/* or create new wiki, and create folder to sync with */}
      <Show
        when={wiki.wiki.wikiFolderPath}
        fallback={
          <Button
            onClick={() => {
              // connectWiki()
            }}
          >
            Connect wiki
          </Button>
        }
      >
        <Button onClick={() => user.setMode("Search Topics")}>
          Open topic to edit
        </Button>
      </Show>
    </div>
  )
}
