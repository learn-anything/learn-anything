import { CoreTypes, EventData, Image } from '@nativescript/core';
import { Route, StackRouter, useParams } from './router';
import { Home } from './Pages/Home';
import { Note } from './Pages/Note';
import { Settings } from './Pages/Settings';
import { SettingsProfile } from './Pages/SettingsProfile';
import { SettingsPreference } from './Pages/SettingsPreference';
import { SettingsMember } from './Pages/SettingsMember';
import { GlobalProvider, createGlobalState } from './Global/global';
import { initKeyboardHelper } from './Utils/Device.util';
import { registerElement } from 'dominative';
import { registerSwiftUI, SwiftUI, UIDataDriver } from '@nativescript/swift-ui';

// setup global utility helpers
initKeyboardHelper();

if (__IOS__) {
  registerElement('swiftui', SwiftUI);

  registerSwiftUI('testView', view => new UIDataDriver(TestViewProvider.alloc().init(), view));
}

const App = () => {
  const global = createGlobalState();

  return (
    <>
      <gridlayout rows="auto,*" class="h-full w-full bg-black">
        <label row="0" class="my-4 ml-4 text-lg italic text-white">
          Try modifying markdown!
        </label>
        {__IOS__ && <swiftui row="1" swiftId="testView" class="h-full w-full" />}
        {__ANDROID__ && (
          <label row="1" class="my-4 ml-4 text-lg italic leading-3 text-white" textWrap="true">
            Can do something cool here - maybe even use react-native-live-markdown.
          </label>
        )}
      </gridlayout>
    </>
  );
};
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
export { App };
