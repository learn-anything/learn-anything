import { Suspense } from "solid-js"
import Mobius from "graphql-mobius"
import App from "./App"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"
import { grafbaseTypeDefs } from "@la/shared/lib"

export function createMobius(options: { hankoCookie: () => string }) {
  const { hankoCookie } = options

  const mobius = new Mobius<typeof grafbaseTypeDefs>({
    fetch: (query) =>
      fetch(import.meta.env.VITE_GRAFBASE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hankoCookie()}`,
        },
        body: JSON.stringify({
          query,
          variables: {},
        }),
      }).then((res) => res.json()),
  })

  return mobius
}

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
