import { NativeScriptConfig } from "@nativescript/core"

export default {
  id: "org.nativescript.dominativesolid",
  appPath: "app",
  appResourcesPath: "App_Resources",
  android: {
    v8Flags: "--expose_gc",
    markingMode: "none"
  },
  ios: {
    SPMPackages: [
      {
        name: "SwiftDown",
        libs: ["SwiftDown"],
        repositoryURL: "https://github.com/qeude/SwiftDown.git",
        version: "0.3.1"
      }
    ]
  }
} as NativeScriptConfig
