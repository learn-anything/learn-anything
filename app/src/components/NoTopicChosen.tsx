import { Show } from "solid-js"
import { useWiki } from "../GlobalContext/wiki"
import Button from "./Button"
import { useUser } from "../GlobalContext/user"
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs"
import { open } from "@tauri-apps/api/dialog"
import { select } from "~/edgedb/dbschema/edgeql-js"
import { useGlobalState } from "~/GlobalContext/global"
// import { connectWiki } from "#preload"

export default function NoTopicChosen() {
  const global = useGlobalState()
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
            onClick={async () => {
              // connectWiki()
              // TODO: should take in a folder
              // then you get access to all the files in folder
              // check that it works across app restarts (same UX as Obsidian)
              // below takes one .md file currently and prints the content of it
              const selectedFile = await open({
                multiple: false,
                filters: [
                  {
                    name: "MD",
                    extensions: ["md"],
                  },
                ],
              })
              const content = await readTextFile(selectedFile as string)
              console.log(content)
            }}
          >
            Connect wiki
          </Button>
        }
      >
        <Button onClick={() => global.set("mode", "SearchTopics")}>
          Open topic to edit
        </Button>
      </Show>
    </div>
  )
}
