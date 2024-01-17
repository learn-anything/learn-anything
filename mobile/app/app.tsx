import { CoreTypes, EventData, Image } from "@nativescript/core"
import { Route, StackRouter } from "./router"
import { Home } from "./Pages/Home"
import { Settings } from "./Pages/Settings"
import { SettingsProfile } from "./Pages/SettingsProfile"
import { SettingsPreference } from "./Pages/SettingsPreference"
import { SettingsMember } from "./Pages/SettingsMember"

const App = () => {
  let logo: Image
  let pulsating = false
  const loadedLogo = (args: EventData) => {
    logo = args.object as Image
    if (!pulsating) {
      pulsating = true
      pulseLogo()
    }
  }
  const pulseLogo = () => {
    logo
      .animate({
        scale: { x: 1.2, y: 1.2 },
        opacity: 1,
        duration: 1000,
        iterations: 1,
        curve: CoreTypes.AnimationCurve.easeInOut
      })
      .then(() => {
        logo
          .animate({
            scale: { x: 1, y: 1 },
            opacity: 0.8,
            duration: 800,
            iterations: 1,
            curve: CoreTypes.AnimationCurve.easeInOut
          })
          .then(() => {
            pulseLogo()
          })
      })
  }

  // draft commit
  return (
    <>
      <StackRouter initialRouteName="Settings">
        <Route name="Home" component={Home} />
        <Route name="Settings" component={Settings} />
        <Route name="SettingsProfile" component={SettingsProfile} />
        <Route name="SettingsPreference" component={SettingsPreference} />
        <Route name="SettingsMember" component={SettingsMember} />
      </StackRouter>
    </>
  )
}

export { App }
