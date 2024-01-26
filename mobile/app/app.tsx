import { CoreTypes, EventData, Image } from "@nativescript/core"
import { Route, StackRouter, useParams } from "./router"
import { Home } from "./Pages/Home"
import { Note } from "./Pages/Note"
import { Settings } from "./Pages/Settings"
import { SettingsProfile } from "./Pages/SettingsProfile"
import { SettingsPreference } from "./Pages/SettingsPreference"
import { SettingsMember } from "./Pages/SettingsMember"
import { GlobalProvider, createGlobalState } from "./Global/global"
import { registerSwiftUI, SwiftUI, UIDataDriver } from "@nativescript/swift-ui"

const App = () => {
  const global = createGlobalState()

  // draft commit
  return (
    <>
      <stacklayout>
        <swiftui swiftId="testView" />
      </stacklayout>
    </>
  )
}
{
  /* <GlobalProvider value={global}>
        <StackRouter initialRouteName="Home">
          <Route name="Home" component={Home} />
          <Route name="Settings" component={Settings} />
          <Route name="SettingsProfile" component={SettingsProfile} />
          <Route name="SettingsPreference" component={SettingsPreference} />
          <Route name="SettingsMember" component={SettingsMember} />
          <Route name="Notes" component={Note} />
        </StackRouter>
      </GlobalProvider> */
}
export { App }
