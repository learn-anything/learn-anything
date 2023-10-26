export async function log(message: any, data?: Record<string, any>) {
  if (!import.meta.env.VITE_PRODUCTION) {
    console.log(message)
    return
  }
  const url = `https://events.baselime.io/v1/website/${window.location.hostname}/${window.location.pathname}`

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_BASELIME_API_KEY!
    },
    body: JSON.stringify([{ message, data }])
  }
  await fetch(url, requestOptions)
}

export async function logError(error: any, data?: Record<string, any>) {
  if (!import.meta.env.VITE_PRODUCTION!) {
    console.log(error)
    return
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
  const url = `https://events.baselime.io/v1/website/errors`

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_BASELIME_API_KEY!
    },
    body: JSON.stringify([{ error, data }])
  }
  await fetch(url, requestOptions)
}
