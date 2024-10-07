/**
 *
 * Utility function to get env variables.
 *
 * @param name env variable name
 * @param defaultVaue default value to return if the env variable is not set
 * @returns string
 *
 * @internal
 */
export const getEnvVariable = (
  name: string,
  defaultVaue: string = "",
): string => {
  // Node envs
  if (
    typeof process !== "undefined" &&
    process.env &&
    typeof process.env[name] === "string"
  ) {
    return (process.env[name] as string) || defaultVaue
  }

  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env[name] === "string"
  ) {
    return import.meta.env[name]
  }

  return defaultVaue
}
