import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export const Route = createFileRoute("/_layout/_pages/_protected/settings/")({
  component: () => <SettingsComponent />,
})

const MODIFIER_KEYS = ["Control", "Alt", "Shift", "Meta"]

const HotkeyInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => {
  const [recording, setRecording] = useState(false)
  const [currentKeys, setCurrentKeys] = useState<string[]>([])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault()
      if (!recording) return
      const key = e.key === " " ? "Space" : e.key
      if (!currentKeys.includes(key)) {
        setCurrentKeys((prev) => {
          const newKeys = [...prev, key]
          return newKeys.slice(-3)
        })
      }
    },
    [recording, currentKeys],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (!recording) return
      const key = e.key === " " ? "Space" : e.key
      if (MODIFIER_KEYS.includes(key)) return
      if (currentKeys.length > 0) {
        onChange(currentKeys.join("+"))
        setRecording(false)
        setCurrentKeys([])
      }
    },
    [recording, currentKeys, onChange],
  )

  useEffect(() => {
    if (recording) {
      const handleKeyDownEvent = (e: KeyboardEvent) =>
        handleKeyDown(e as unknown as React.KeyboardEvent)
      const handleKeyUpEvent = (e: KeyboardEvent) =>
        handleKeyUp(e as unknown as React.KeyboardEvent)
      window.addEventListener("keydown", handleKeyDownEvent)
      window.addEventListener("keyup", handleKeyUpEvent)
      return () => {
        window.removeEventListener("keydown", handleKeyDownEvent)
        window.removeEventListener("keyup", handleKeyUpEvent)
      }
    }
  }, [recording, handleKeyDown, handleKeyUp])

  return (
    <div className="mb-4 space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={recording ? currentKeys.join("+") : value}
          placeholder="Click to set hotkey"
          className="flex-grow"
          readOnly
          onClick={() => setRecording(true)}
        />
        <Button
          onClick={() => {
            if (recording) {
              setRecording(false)
              setCurrentKeys([])
            } else {
              setRecording(true)
            }
          }}
          variant={recording ? "destructive" : "secondary"}
        >
          {recording ? "Cancel" : "Set"}
        </Button>
      </div>
    </div>
  )
}

const SettingsComponent = () => {
  // const { me } = useAccount()
  const [inboxHotkey, setInboxHotkey] = useState("")
  const [topInboxHotkey, setTopInboxHotkey] = useState("")

  const saveSettings = () => {
    toast.success("Settings saved", {
      description: "Your hotkey settings have been updated.",
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="p-6 text-2xl font-semibold">Settings</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <section className="mb-8 max-w-md">
          <HotkeyInput
            label="Save to Inbox"
            value={inboxHotkey}
            onChange={setInboxHotkey}
          />
          <HotkeyInput
            label="Save to Inbox (Top)"
            value={topInboxHotkey}
            onChange={setTopInboxHotkey}
          />
        </section>
        <Button onClick={saveSettings}>Save Settings</Button>
      </main>
    </div>
  )
}
