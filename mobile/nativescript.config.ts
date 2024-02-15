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
      // Note: may consider using this as well
      // {
      //   name: "HighlightedTextEditor",
      //   libs: ["HighlightedTextEditor"],
      //   repositoryURL: "https://github.com/kyle-n/HighlightedTextEditor.git",
      //   version: "2.1.2"
      // }

      
    ]
  }
} as NativeScriptConfig
