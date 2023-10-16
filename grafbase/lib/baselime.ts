export async function log(message: any, data?: Record<string, any>) {
  if (process.env.LOCAL) {
    console.log(message)
    return
  }
  const url = `https://events.baselime.io/v1/cloudflare-workers/grafbase/logs`

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ message, data }])
  }
  await fetch(url, requestOptions)
}

export async function logError(error: any, data?: Record<string, any>) {
  if (process.env.LOCAL) {
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
  const url = `https://events.baselime.io/v1/cloudflare-workers/grafbase/error`

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ error, data }])
  }
  await fetch(url, requestOptions)
}
