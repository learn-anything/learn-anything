import { promises as fs } from "fs"
import path from "path"
import os from "os"

// TODO: make it into library function like: https://github.com/nikitavoloboev/log_macro
// it takes in a variable and is generic
// if its a string it JSON.stringify's it then saves it to the `variable-name.json` file
// if its array, it does the same. make it work for all kinds of variables
// idea is to basically persist variable value to a file nicely
// thus it should only take one argument
export async function writeContentToDesktopFile(
  text: string,
  fileName: string,
): Promise<void> {
  const desktopDir = path.join(os.homedir(), "Desktop")
  const filePath = path.join(desktopDir, fileName)

  try {
    await fs.writeFile(filePath, text)
    console.log(`File written successfully to ${filePath}`)
  } catch (error) {
    console.error("An error occurred:", error)
  }
}
