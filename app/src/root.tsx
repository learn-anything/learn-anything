import { Suspense } from "solid-js"
import App from "./App"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"

export default function Root() {
  const global = createGlobalState()
  const user = createUserState()
  const wiki = createWikiState()

  return (
    <>
      <Suspense>
        <GlobalStateProvider value={global}>
          <UserProvider value={user}>
            <WikiProvider value={wiki}>
              {/* TODO: should solid router be used here just like in website? */}
              <App />
            </WikiProvider>
          </UserProvider>
        </GlobalStateProvider>
      </Suspense>
    </>
  )
}
