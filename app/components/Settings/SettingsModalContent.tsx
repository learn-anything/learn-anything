import { SettingsTab } from "./SettingsModal"

interface SettingsModalContentProps {
  activeTab: SettingsTab
}

export default function SettingsModalContent({
  activeTab,
}: SettingsModalContentProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {activeTab === "account" && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-white/80">
            Manage your account settings and Appearance
          </p>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <p className="text-white/80">Manage your notification preferences</p>
        </div>
      )}

      {activeTab === "data" && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Data Settings</h3>
          <p className="text-white/80">Control your data</p>
        </div>
      )}
    </div>
  )
}
