/**
 * Entry function for get app version.
 * In current implementation, it returns `version` from `package.json`, but you can implement any logic here.
 * Runs several times for each vite configs and electron-builder config.
 * @return {string}
 */
export function getVersion() {
  return process.env.npm_package_version;
}
