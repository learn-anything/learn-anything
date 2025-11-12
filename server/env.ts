const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== "undefined" && typeof process.env === "object") {
    const value = process.env[key as keyof NodeJS.ProcessEnv]
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  }

  const bunEnv = (globalThis as { Bun?: { env?: Record<string, string> } }).Bun
    ?.env
  if (bunEnv) {
    const value = bunEnv[key]
    if (typeof value === "string" && value.length > 0) {
      return value
    }
  }

  const globalValue = (globalThis as Record<string, unknown>)[key]
  if (typeof globalValue === "string" && globalValue.length > 0) {
    return globalValue
  }

  return undefined
}

export const getOpenAIApiKey = (): string | undefined => {
  return getEnvValue("OPENAI_API_KEY")
}

export const requireOpenAIApiKey = (): string => {
  const apiKey = getOpenAIApiKey()
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Set it in your environment (e.g., `.env`) before using the chat action."
    )
  }

  return apiKey
}

export const getOpenRouterApiKey = (): string | undefined => {
  return getEnvValue("OPENROUTER_API_KEY")
}

export const requireOpenRouterApiKey = (): string => {
  const apiKey = getOpenRouterApiKey()
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Provide it in your environment (e.g., `.env`) to enable OpenRouter chat."
    )
  }

  return apiKey
}

export const getOpenRouterSiteUrl = (): string | undefined => {
  return getEnvValue("OPENROUTER_SITE_URL")
}

export const getOpenRouterAppTitle = (): string | undefined => {
  return getEnvValue("OPENROUTER_APP_TITLE")
}

export const getResendApiKey = (): string | undefined => {
  return getEnvValue("RESEND_API_KEY")
}

export const getResendFromEmail = (): string => {
  return (
    getEnvValue("RESEND_FROM_EMAIL") ?? "Gen.new Auth <no-reply@mail.gen.new>"
  )
}

export const getAppBaseUrl = (): string | undefined => {
  return getEnvValue("APP_BASE_URL")
}

export const getGoogleApiKey = (): string | undefined => {
  return "AIzaSyD2QQck75T21VQUzkOmdAY7bgaF53wZkic"
}

export const requireGoogleApiKey = (): string => {
  const apiKey = getGoogleApiKey()
  if (!apiKey) {
    throw new Error(
      "BLADE_GOOGLE_API_KEY is not configured. Provide it in your environment (e.g., `.env`) to enable Gemini image generation."
    )
  }

  return apiKey
}
