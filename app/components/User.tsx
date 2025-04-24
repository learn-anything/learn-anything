import { useState, useEffect, useRef } from "react"
import SettingsModal from "./Settings/SettingsModal"

// type UserProps = {
//   username?: string
// }

export default function User({ username = "User" }: { username?: string }) {
  const [showUserModal, setShowUserModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const userModalRef = useRef<HTMLDivElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  const handleLogout = () => {
    console.log("Logging out...")
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showUserModal &&
        userModalRef.current &&
        userButtonRef.current &&
        !userModalRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserModal])

  return (
    <div className="relative">
      <button
        id="user-button"
        ref={userButtonRef}
        onClick={() => setShowUserModal(!showUserModal)}
        className="flex items-center space-x-2 p-1 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
          {username.charAt(0).toUpperCase()}
        </div>
      </button>

      {showUserModal && (
        <div
          id="user-modal"
          ref={userModalRef}
          className="absolute right-0 top-12 p-2 bg-[#2b2b2bb9] backdrop-blur-sm rounded-2xl z-10 whitespace-nowrap"
        >
          <div className="flex flex-col">
            <button
              onClick={() => {
                setShowUserModal(false)
                setShowSettingsModal(true)
              }}
              className="text-left px-3 py-2 text-sm rounded-xl text-white/80 hover:bg-white/5 transition-colors duration-75"
            >
              Settings
            </button>
            <button className="text-left px-3 py-2 text-sm rounded-xl text-white/80 hover:bg-white/5 transition-colors duration-75">
              Feedback & Support
            </button>
            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors text-white/80 duration-75"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  )
}
