import { app, ipcMain } from "electron"
import "./security-restrictions"
import { restoreOrCreateWindow } from "/@/mainWindow"
import { platform } from "node:process"
import { createStore } from "tinybase/cjs"
import { createSqlite3Persister } from "tinybase/cjs/persisters/persister-sqlite3"
import { Database } from "sqlite3"

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}
app.on("second-instance", restoreOrCreateWindow)

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration()

/**
 * Shut down background process if all windows are closed
 */
app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit()
  }
})

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on("activate", restoreOrCreateWindow)

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("Failed create window:", e))

/**
 * Check for app updates, install it in background and notify user that new version was installed.
 * No reason run this in non-production build.
 * @see https://www.electron.build/auto-update.html#quick-setup-guide
 *
 * Note: It may throw "ENOENT: no such file app-update.yml"
 * if you compile production app without publishing it to distribution server.
 * Like `npm run compile` does. It's ok 😅
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() =>
      /**
       * Here we forced to use `require` since electron doesn't fully support dynamic import in asar archives
       * @see https://github.com/electron/electron/issues/38829
       * Potentially it may be fixed by this https://github.com/electron/electron/pull/37535
       */
      require("electron-updater").autoUpdater.checkForUpdatesAndNotify()
    )
    .catch((e) => console.error("Failed check and install updates:", e))
}

// Create TinyBase store
app
  .whenReady()
  .then(async () => {
    // TODO: check if store already exists
    // maybe that's not necessary
    // how would migrations work?

    // create store
    const store = createStore().setTablesSchema({
      topics: {
        id: { type: "string" },
        filePath: { type: "string" },
        fileContent: { type: "string" },
        topicName: { type: "string" },
        topicContent: { type: "string" },
      },
      notes: {
        topicId: { type: "string" },
        content: { type: "string" },
        url: { type: "string" },
        public: { type: "boolean" },
      },
      links: {
        topicId: { type: "string" },
        title: { type: "string" },
        url: { type: "string" },
        public: { type: "boolean" },
      },
    })
    // persist it to local sqlite db
    const db = new Database("learn-anything")
    const persister = createSqlite3Persister(store, db, {
      mode: "tabular",
      tables: {
        load: {
          topics: "topics",
          notes: "notes",
          links: "links",
        },
        save: {
          topics: "topics",
          notes: "notes",
          links: "links",
        },
      },
    })
    await persister.save()

    // expose persister to preload process
    ipcMain.on("get-persister", (_event, value) => {
      return persister
    })
  })
  .catch((e) => console.error("Failed to create TinyBase store", e))
