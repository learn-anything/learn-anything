# vite-solid-electron

![GitHub stars](https://img.shields.io/github/stars/ch99q/vite-solid-electron?color=fa6470&style=flat)
![GitHub issues](https://img.shields.io/github/issues/ch99q/vite-solid-electron?color=d8b22d&style=flat)
![GitHub license](https://img.shields.io/github/license/ch99q/vite-solid-electron?style=flat)
[![Required Node.JS >= v14.17.0](https://img.shields.io/static/v1?label=node&message=%3E=14.17.0&logo=node.js&color=3f893e&style=flat)](https://nodejs.org/about/releases)

## Overview

- Very simple Vite, SolidJS, Electron integration template.

- Contains only the basic dependencies.

- The extension is very flexible.

## Installation

```bash
# clone the project
git clone https://github.com/ch99q/vite-solid-electron.git

# open the project directory
cd vite-solid-electron

# install dependencies
npm install

# start the application
npm run dev

# make a production build
npm run build
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


## Special thanks

Special thanks to [caoxiemeihao](https://github.com/caoxiemeihao) for almost the entire code base, i just modified a small part to make it work with SolidJS. Original code can be found [here](https://github.com/caoxiemeihao/vite-react-electron)