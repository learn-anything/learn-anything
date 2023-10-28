import { default as Cookies } from "js-cookie"
import { UserClient } from "@teamhanko/hanko-frontend-sdk"

function getSessionId() {
  const sessionId = Cookies.get("baselime-session-id")
  if (!sessionId) {
    Cookies.set("baselime-session-id", crypto.randomUUID())
  }
  return sessionId
}

async function getUserEmail() {
  const userEmail = Cookies.get("signedInEmail")
  if (!userEmail) {
    // TODO: not sure below is needed? what happens on errors that non auth'd users make
    // here for now, maybe need to remove/change
    const token = Cookies.get("hanko")
    if (!token) {
      return null
    }
    const userClient = new UserClient(import.meta.env.VITE_HANKO_API, {
      timeout: 0,
      cookieName: "hanko",
      localStorageKey: "hanko"
    })
    const user = await userClient.getCurrent()
    Cookies.set("signedInEmail", user.email)
    return user.email
  }
  return userEmail
}

export async function log(
  message: any,
  additionalMessage?: string | Record<string, any>
) {
  if (
    import.meta.env.VITE_ENV !== "prod" &&
    import.meta.env.VITE_ENV !== "staging"
  ) {
    console.log(message)
    return
  }
  let url
  if (import.meta.env.VITE_ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-website-logs/${window.location.hostname}/${window.location.pathname}`
  } else {
    url = `https://events.baselime.io/v1/website-logs/${window.location.hostname}/${window.location.pathname}`
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_BASELIME_API_KEY!
    },
    body: JSON.stringify([
      {
        message,
        additionalMessage,
        requestId: getSessionId(),
        userEmail: await getUserEmail()
      }
    ])
  }
  await fetch(url, requestOptions)
}

export async function logError(
  error: any,
  additionalMessage?: string | Record<string, any>
) {
  if (
    import.meta.env.VITE_ENV !== "prod" &&
    import.meta.env.VITE_ENV !== "staging"
  ) {
    console.error(error)
    return
  }
  let url
  if (import.meta.env.VITE_ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-website-errors/${window.location.hostname}/${window.location.pathname}`
  } else {
    url = `https://events.baselime.io/v1/website-errors/${window.location.hostname}/${window.location.pathname}`
  }
  if (typeof error === "object") {
    error = Object.assign(
      {
        message: error.message,
        stack: error.stack
      },
      error
    )
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_BASELIME_API_KEY!
    },
    body: JSON.stringify([
      {
        error,
        additionalMessage,
        requestId: getSessionId(),
        userEmail: await getUserEmail()
      }
    ])
  }
  await fetch(url, requestOptions)
}

export function logUntracked(
  message: any,
  additionalMessage?: string | Record<string, any>
) {
  if (
    import.meta.env.VITE_ENV !== "prod" &&
    import.meta.env.VITE_ENV !== "staging"
  ) {
    // console.log(message)
    return
  }
  let url
  if (import.meta.env.VITE_ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-website-logs/${window.location.hostname}/${window.location.pathname}`
  } else {
    url = `https://events.baselime.io/v1/website-logs/${window.location.hostname}/${window.location.pathname}`
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_BASELIME_API_KEY!
    },
    body: JSON.stringify([
      {
        message,
        additionalMessage
      }
    ])
  }
  return fetch(url, requestOptions)
}
