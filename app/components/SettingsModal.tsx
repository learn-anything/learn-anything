import { useState } from "react"
import SettingsModalSidebar from "./SettingsModalSidebar"
import SettingsModalContent from "./SettingsModalContent"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export type SettingsTab = "account" | "notifications" | "privacy"

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")

  if (!isOpen) return null

  return (
    <div
      id="settings-modal-container"
      className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-[#2b2b2bb9] backdrop-blur-sm p-5 rounded-3xl w-full max-w-2xl max-h-[500px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/80 text-lg hover:text-white hover:bg-white/10 w-8 h-8 flex items-center p-auto justify-center rounded-xl transition-colors duration-75"
          >
            ×
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-1/5">
            <SettingsModalSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="w-4/5 flex justify-center">
            <SettingsModalContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  )
}
