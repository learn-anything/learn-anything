import { CoreTypes, EventData, Image } from "@nativescript/core"
import { Route, StackRouter } from "./router"
import { Home } from "./Pages/Home"
import { Settings } from "./Pages/Settings"
import { SettingsProfile } from "./Pages/SettingsProfile"
import { SettingsPreference } from "./Pages/SettingsPreference"
import { SettingsMember } from "./Pages/SettingsMember"
import { GlobalProvider, createGlobalState } from "./Global/global"

const App = () => {
  const global = createGlobalState()

  // draft commit
  return (
    <>
      <GlobalProvider value={global}>
        <StackRouter initialRouteName="Home">
          <Route name="Home" component={Home} />
          <Route name="Settings" component={Settings} />
          <Route name="SettingsProfile" component={SettingsProfile} />
          <Route name="SettingsPreference" component={SettingsPreference} />
          <Route name="SettingsMember" component={SettingsMember} />
        </StackRouter>
      </GlobalProvider>
    </>
  )
}

export { App }
