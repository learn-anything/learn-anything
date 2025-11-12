import "../../app.global.css"
import { useEffect, useRef, useState } from "react"
import { useMutation } from "blade/client/hooks"

interface SignupPageProps {
  token: string | null
}

type VerificationStatus = "idle" | "verifying" | "success" | "error"

export default function SignupPage({ token }: SignupPageProps) {
  const { add } = useMutation()
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "verifying" : "idle"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const processedTokenRef = useRef<string | null>(null)
  const hasToken = Boolean(token)

  useEffect(() => {
    const verify = async () => {
      if (!token || processedTokenRef.current === token) return
      processedTokenRef.current = token
      setStatus("verifying")
      try {
        await add.session.with({
          account: { emailVerificationToken: token },
        })
        setStatus("success")
        setErrorMessage(null)
      } catch (error) {
        const alreadyVerified =
          error instanceof Error &&
          /already has a verified email address/i.test(error.message)
        if (alreadyVerified) {
          setStatus("success")
          setErrorMessage(null)
          return
        }
        const fallback =
          "That token is not valid anymore. Request a new confirmation email from the signup page."
        setErrorMessage(error instanceof Error ? error.message : fallback)
        setStatus("error")
      }
    }
    void verify()
  }, [token, add.session])

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-md space-y-6 text-center">
        {hasToken ? (
          <>
            {status === "success" ? (
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold tracking-tight">
                  You are authenticated. Enjoy.
                </h1>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold transition hover:bg-white/90"
                >
                  Use gen.new
                </a>
              </div>
            ) : status === "verifying" ? (
              <p className="text-sm text-white/70">Finishing sign in...</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-rose-200/80">
                  {errorMessage ??
                    "We couldn’t verify that link. Please request a new one from the signup page."}
                </p>
                <a
                  href="/auth"
                  className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  Go back to signup
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">
              Almost there
            </h1>
            <p className="text-sm text-white/70">
              The confirmation link is missing a token. Open the email we sent
              you and tap Confirm Registration again.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Go back to signup
            </a>
          </>
        )}
      </div>
    </div>
  )
}
