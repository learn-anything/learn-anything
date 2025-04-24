import { SettingsTab } from "./SettingsModal"
import { ReactNode } from "react"

interface SettingsModalSidebarProps {
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
}

interface SidebarButtonProps {
  tab: SettingsTab
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
  label: string
  icon?: ReactNode
}

function SidebarButton({
  tab,
  activeTab,
  setActiveTab,
  label,
  icon,
}: SidebarButtonProps) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`text-left px-3 py-2 rounded-xl transition-colors text-white duration-75 flex items-center gap-2 ${
        activeTab === tab ? "bg-white/5" : " hover:bg-white/3"
      }`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <h3 className="text-sm font-medium">{label}</h3>
    </button>
  )
}

export default function SettingsModalSidebar({
  activeTab,
  setActiveTab,
}: SettingsModalSidebarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <SidebarButton
        tab="account"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        label="Account"
      />

      <SidebarButton
        tab="notifications"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        label="Notifications"
      />

      <SidebarButton
        tab="data"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        label="Data"
      />
    </div>
  )
}
