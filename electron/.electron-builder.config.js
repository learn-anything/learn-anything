/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "YourAppID",
  productName: "YourAppName",
  copyright: "Copyright © 2022 ${author}",
  asar: true,
  directories: {
    output: "release/${version}",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: "${productName}-${version}-Setup.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-${version}-Installer.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-${version}-Installer.${ext}",
  },
}
