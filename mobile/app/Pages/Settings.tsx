import { PageTransition, SharedTransition } from '@nativescript/core';
import { useRouter } from '../router';

export const Settings = () => {
  const router = useRouter();
  const goToPage = (name: 'Home' | 'Settings' | 'SettingsMember' | 'SettingsPreference' | 'SettingsProfile') => {
    // just showing ios shared transition with platform spring built in
    router.navigate(
      name,
      global.isIOS
        ? {
            transition: SharedTransition.custom(new PageTransition()),
          }
        : undefined
    );
  };
  return (
    <>
      <actionbar title="Settings" class="bg-black"></actionbar>
      <flexboxlayout flexDirection="Column" class="">
        <stacklayout
          class="border-y border-[#909090] p-[80px] text-[20px] font-bold"
          on:tap={() => {
            goToPage('SettingsProfile');
          }}
        >
          <label text="Profile"></label>
          <label text="Manage your profile" class="text-[14px] font-light"></label>
        </stacklayout>
        <stacklayout
          class="border-b border-[#909090] p-[80px] text-[20px] font-bold"
          on:tap={() => {
            goToPage('SettingsMember');
          }}
        >
          <label text="Manage Memberships"></label>
          <label text="Manage your subscriptions" class="text-[14px] font-light"></label>
        </stacklayout>
        <stacklayout
          class="border-b border-[#909090] p-[80px] text-[20px] font-bold"
          on:tap={() => {
            goToPage('SettingsPreference');
          }}
        >
          <label text="Preference"></label>
          <label text="Notifications etc..." class="text-[14px] font-light"></label>
        </stacklayout>
      </flexboxlayout>
    </>
  );
};
