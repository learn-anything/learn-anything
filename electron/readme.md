# LA Electron app

Based off this [nice template](https://github.com/ch99q/vite-solid-electron).

To run:

```bash
pnpm i
pnpm run dev
pnpm run build
```

## Directory structure

Once `dev` or `build` npm-script is executed, the `dist` folder will be generated. It has the same structure as the `packages` folder, the purpose of this design is to ensure the correct path calculation.

```tree
├
├── build                     Resources for the production build
├   ├── icon.icns             Icon for the application on macOS
├   ├── icon.ico              Icon for the application
├   ├── installerIcon.ico     Icon for the application installer
├   ├── uninstallerIcon.ico   Icon for the application uninstaller
├
├── dist                      Generated after build according to the "packages" directory
├   ├── main
├   ├── preload
├   ├── renderer
├
├── release                   Generated after production build, contains executables
├   ├── {version}
├       ├── win-unpacked      Contains unpacked application executable
├       ├── Setup.exe         Installer for the application
├
├── scripts
├   ├── build.mjs             Develop script -> npm run build
├   ├── watch.mjs             Develop script -> npm run dev
├
├── packages
├   ├── main                  Main-process source code
├       ├── vite.config.ts
├   ├── preload               Preload-script source code
├       ├── vite.config.ts
├   ├── renderer              Renderer-process source code
├       ├── vite.config.ts
├
```

## Use Electron and NodeJS API

> 🚧 By default, Electron doesn't support the use of API related to Electron and NodeJS in the Renderer process, but someone might need to use it. If so, you can see the template 👉 **[electron-vite-boilerplate](https://github.com/caoxiemeihao/electron-vite-boilerplate)**

#### Invoke Electron and NodeJS API in `Preload-script`

- **packages/preload/index.ts**

    ```typescript
    import fs from "fs"
    import { contextBridge, ipcRenderer } from "electron"

    // --------- Expose some API to Renderer-process. ---------
    contextBridge.exposeInMainWorld("fs", fs)
    contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)
    ```

- **packages/renderer/src/global.d.ts**

    ```typescript
    // Defined in the window
    interface Window {
      fs: typeof import("fs")
      ipcRenderer: import("electron").IpcRenderer
    }
    ```

- **packages/renderer/src/main.ts**

    ```typescript
    // Use Electron and NodeJS API in the Renderer-process
    console.log("fs", window.fs)
    console.log("ipcRenderer", window.ipcRenderer)
    ```

## Use SerialPort, SQLite3, or other node-native addons in the Main-process

- First, you need to make sure that the dependencies in the `package.json` are NOT in the "devDependencies". Because the project will need them after packaged.

- Main-process, Preload-script are also built with Vite, and they're built as [build.lib](https://vitejs.dev/config/#build-lib).
    So they just need to configure Rollup.

**Click to see more** 👉 [packages/main/vite.config.ts](https://github.com/ch99q/vite-solid-electron/blob/main/packages/main/vite.config.ts)

```js
export default {
  build: {
    // built lib for Main-process, Preload-script
    lib: {
      entry: "index.ts",
      formats: ["cjs"],
      fileName: () => "[name].js",
    },
    rollupOptions: {
      // configuration here
      external: ["serialport", "sqlite3"],
    },
  },
}
```

## `dependencies` vs `devDependencies`

- First, you need to know if your dependencies are needed after the application is packaged.

- Like [serialport](https://www.npmjs.com/package/serialport), [sqlite3](https://www.npmjs.com/package/sqlite3) they are node-native modules and should be placed in `dependencies`. In addition, Vite will not build them, but treat them as external modules.

- Dependencies like [Vue](https://www.npmjs.com/package/vue) and [SolidJS](https://www.npmjs.com/package/solid-js), which are pure javascript modules that can be built with Vite, can be placed in `devDependencies`. This reduces the size of the application.

## Result

<img width="400px" src="https://raw.githubusercontent.com/caoxiemeihao/blog/main/vite-solid-electron/react-win.png" />
