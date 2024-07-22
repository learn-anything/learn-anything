import React, { useEffect, useMemo, useState } from "react"
import { BrowserDemoAuth, AuthProvider } from "jazz-browser"
import { Account, CoValueClass, ID } from "jazz-tools"
import { AgentSecret } from "cojson"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Types
export type AuthState = "loading" | "ready" | "signedIn"

export type ReactAuthHook<Acc extends Account> = (
  setJazzAuthState: (state: AuthState) => void
) => {
  auth: AuthProvider<Acc>
  AuthUI: React.ReactNode
  logOut?: () => void
}

type DemoAuthProps<Acc extends Account = Account> = {
  accountSchema?: CoValueClass<Acc> & typeof Account
  appName: string
  appHostname?: string
  Component?: DemoAuth.Component
  seedAccounts?: {
    [name: string]: { accountID: ID<Account>; accountSecret: AgentSecret }
  }
}

type AuthComponentProps = {
  appName: string
  loading: boolean
  existingUsers: string[]
  logInAs: (existingUser: string) => void
  signUp: (username: string) => void
}

// Main DemoAuth function
export function DemoAuth<Acc extends Account = Account>({
  accountSchema = Account as CoValueClass<Acc> & typeof Account,
  appName,
  appHostname,
  Component = DemoAuth.BasicUI,
  seedAccounts
}: DemoAuthProps<Acc>): ReactAuthHook<Acc> {
  return function useLocalAuth(setJazzAuthState) {
    const [authState, setAuthState] = useState<AuthState>("loading")
    const [existingUsers, setExistingUsers] = useState<string[]>([])
    const [logInAs, setLogInAs] = useState<(existingUser: string) => void>(
      () => () => {}
    )
    const [signUp, setSignUp] = useState<(username: string) => void>(
      () => () => {}
    )
    const [logOut, setLogOut] = useState<(() => void) | undefined>(undefined)
    const [logOutCounter, setLogOutCounter] = useState(0)

    useEffect(() => {
      setJazzAuthState(authState)
    }, [authState, setJazzAuthState])

    const auth = useMemo(() => {
      return new BrowserDemoAuth<Acc>(
        accountSchema,
        {
          onReady(next) {
            setAuthState("ready")
            setExistingUsers(next.existingUsers)
            setLogInAs(() => next.logInAs)
            setSignUp(() => next.signUp)
          },
          onSignedIn(next) {
            setAuthState("signedIn")
            setLogOut(() => () => {
              next.logOut()
              setAuthState("loading")
              setLogOutCounter((c) => c + 1)
            })
          }
        },
        appName,
        seedAccounts
      )
    }, [])

    const AuthUI = (
      <Component
        appName={appName}
        loading={authState === "loading"}
        existingUsers={existingUsers}
        logInAs={logInAs}
        signUp={signUp}
      />
    )

    return { auth, AuthUI, logOut }
  }
}

const DemoAuthBasicUI: React.FC<AuthComponentProps> = ({
  appName,
  existingUsers,
  logInAs,
  signUp
}) => {
  const [username, setUsername] = useState<string>("")
  const darkMode = useDarkMode()

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div className="mx-auto h-full w-full max-w-sm space-y-6 p-4">
        <h1 className="text-center font-semibold">{appName}</h1>
        <SignUpForm
          username={username}
          setUsername={setUsername}
          signUp={signUp}
          darkMode={darkMode}
        />
        <ExistingUsersList
          existingUsers={existingUsers}
          logInAs={logInAs}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

// Helper components
const SignUpForm: React.FC<{
  username: string
  setUsername: (value: string) => void
  signUp: (username: string) => void
  darkMode: boolean
}> = ({ username, setUsername, signUp, darkMode }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      signUp(username)
    }}
    className="flex flex-col gap-y-4"
  >
    <Input
      placeholder="Display name"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      autoComplete="webauthn"
    />
    <Button type="submit">Sign Up as new account</Button>
  </form>
)

const ExistingUsersList: React.FC<{
  existingUsers: string[]
  logInAs: (user: string) => void
  darkMode: boolean
}> = ({ existingUsers, logInAs, darkMode }) => (
  <div className="flex flex-col gap-y-2">
    {existingUsers.map((user) => (
      <Button key={user} onClick={() => logInAs(user)}>
        Log In as &quot;{user}&quot;
      </Button>
    ))}
  </div>
)

// Hooks
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setDarkMode(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return darkMode
}

// DemoAuth namespace
export namespace DemoAuth {
  export type Component = React.FC<AuthComponentProps>
  export const BasicUI = DemoAuthBasicUI
}
