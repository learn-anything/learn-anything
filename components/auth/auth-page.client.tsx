import "../../app.global.css"
import { useMutation } from "blade/client/hooks"
import { Apple, Chrome, Github, Mail } from "lucide-react"
import { useState, type FormEvent } from "react"

const providerButtons = [
  { label: "Apple", Icon: Apple },
  { label: "Google", Icon: Chrome },
  { label: "GitHub", Icon: Github },
]

const generateRandomPassword = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID().replace(/-/g, "")
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AuthPage() {
  const { add, set } = useMutation()
  const [email, setEmail] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sendSignupEmail = async (normalizedEmail: string) => {
    await add.account.with({
      email: normalizedEmail,
      password: generateRandomPassword(),
    })
    setStatusMessage(
      "Welcome! Confirm your email from the message we just sent."
    )
  }

  const resendConfirmation = async (normalizedEmail: string) => {
    await set.account({
      with: { email: normalizedEmail },
      to: { emailVerificationSentAt: new Date() },
    })
    setStatusMessage(
      "Check your inbox—we just sent you a secure link to continue."
    )
  }

  const sendLoginLink = async (normalizedEmail: string) => {
    await set.account({
      with: { email: normalizedEmail },
      to: { password: null },
    })
    setStatusMessage(
      "You’re verified already, so we emailed you a fresh login link."
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setErrorMessage("Enter a valid email before continuing.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await resendConfirmation(normalizedEmail)
      return
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "RecordNotFoundError") {
          try {
            await sendSignupEmail(normalizedEmail)
            return
          } catch (creationError) {
            const fallback =
              "We couldn’t start signup. Please try again in a moment."
            setErrorMessage(
              creationError instanceof Error ? creationError.message : fallback
            )
            return
          }
        }
        if (error.name === "SetNotAllowedError") {
          try {
            await sendLoginLink(normalizedEmail)
            return
          } catch (loginError) {
            const fallback =
              "We couldn’t send a login link right now. Try again in a moment."
            setErrorMessage(
              loginError instanceof Error ? loginError.message : fallback
            )
            return
          }
        }
      }
      const fallback =
        "We couldn’t reach the auth service right now. Try again shortly."
      setErrorMessage(error instanceof Error ? error.message : fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
          <header className="space-y-2 text-left">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
              <Mail className="h-3.5 w-3.5" />
              Welcome to linsa.io!
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your lens into everything.
            </h1>
            <p className="text-sm text-white/70">
              Save contacts, images, everything. Chat. Share with community.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2 text-left">
              <p className="text-sm font-medium text-white">
                Enter your email and we’ll send a login link.
              </p>
            </div>

            <label className="block text-left text-xs font-semibold uppercase tracking-wide text-white/60">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@gmail.com"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-0"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending link..." : "Email me a login link"}
            </button>
          </form>

          {(statusMessage || errorMessage) && (
            <p
              className={`mt-4 text-sm ${
                statusMessage ? "text-emerald-300/90" : "text-rose-200/80"
              }`}
            >
              {statusMessage ?? errorMessage}
            </p>
          )}

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Coming soon
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {providerButtons.map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
