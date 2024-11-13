import * as React from "react"
import { useAccount } from "@/lib/providers/jazz-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { createFileRoute } from "@tanstack/react-router"
import { useUser } from "@clerk/tanstack-start"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_pages/_protected/profile/")({
  component: () => <ProfileComponent />,
})

interface ProfileStatsProps {
  number: number
  label: string
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ number, label }) => {
  return (
    <div className="text-center font-semibold text-black/60 dark:text-white">
      <p className="text-4xl">{number}</p>
      <p className="text-[#878787]">{label}</p>
    </div>
  )
}

function ProfileComponent() {
  const account = useAccount({
    profile: {},
    root: {
      topicsLearning: [{}],
      topicsWantToLearn: [{}],
      topicsLearned: [{}],
    },
  })
  const username = ""
  const { user } = useUser()
  const avatarInputRef = React.useRef<HTMLInputElement>(null)

  const editAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      if (account.me && account.me.profile) {
        account.me.profile.avatarUrl = imageUrl
      }
    }
  }

  const [isEditing, setIsEditing] = React.useState(false)
  const [newName, setNewName] = React.useState(account.me?.profile?.name || "")
  const [error, setError] = React.useState("")

  const editProfileClicked = () => {
    setIsEditing(true)
    setError("")
  }

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
    setError("")
  }

  const validateName = React.useCallback((name: string) => {
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (name.trim().length > 40) {
      return "Name must not exceed 40 characters"
    }
    return ""
  }, [])

  const saveProfile = () => {
    const validationError = validateName(newName)
    if (validationError) {
      setError(validationError)
      return
    }

    if (account.me && account.me.profile) {
      account.me.profile.name = newName.trim()
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setNewName(account.me?.profile?.name || "")
    setIsEditing(false)
    setError("")
  }

  if (!account.me || !account.me.profile) {
    return (
      <div className="flex h-screen flex-col py-3 text-black dark:text-white">
        <div className="flex flex-1 flex-col rounded-3xl border border-neutral-800">
          <p className="my-10 h-[74px] border-b border-neutral-900 text-center text-2xl font-semibold">
            Oops! This account doesn&apos;t exist.
          </p>
          <p className="mb-5 text-center text-lg font-semibold">
            Try searching for another.
          </p>
          <p className="mb-5 text-center text-lg font-semibold">
            The link you followed may be broken, or the page may have been
            removed. Go back to
            <Link to="/">homepage</Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col text-black dark:text-white">
      <div className="flex items-center justify-between p-[20px]">
        <p className="text-2xl font-semibold opacity-70">Profile</p>
      </div>
      <p className="text-2xl font-semibold">{username}</p>
      <div className="flex flex-col items-center border-b border-neutral-900 bg-inherit pb-5">
        <div className="flex w-full max-w-2xl align-top">
          <Button
            onClick={() => avatarInputRef.current?.click()}
            variant="ghost"
            className="p-0 hover:bg-transparent"
          >
            <Avatar className="size-20">
              <AvatarImage
                src={account.me?.profile?.avatarUrl || user?.imageUrl}
                alt={user?.fullName || ""}
              />
            </Avatar>
          </Button>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={editAvatar}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="ml-6 flex-1">
            {isEditing ? (
              <>
                <Input
                  value={newName}
                  onChange={changeName}
                  className="mb-3 mr-3 border-result text-[25px] font-semibold"
                />
                {error && (
                  <p className="text-red-500 text-opacity-70">{error}</p>
                )}
              </>
            ) : (
              <p className="mb-3 text-[25px] font-semibold">
                {account.me?.profile?.name}
              </p>
            )}
          </div>
          {isEditing ? (
            <div>
              <Button onClick={saveProfile} className="mr-2">
                Save
              </Button>
              <Button onClick={cancelEditing} variant="outline">
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={editProfileClicked}
              className="shadow-outer ml-auto flex h-[34px] cursor-pointer flex-row items-center justify-center space-x-2 rounded-lg bg-white px-3 text-center font-medium text-black shadow-[1px_1px_1px_1px_rgba(0,0,0,0.3)] hover:bg-black/10 dark:bg-[#222222] dark:text-white dark:hover:opacity-60"
            >
              Edit profile
            </Button>
          )}
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <div className="flex flex-row gap-20">
          <ProfileStats
            number={account.me.root?.topicsLearning?.length || 0}
            label="Learning"
          />
          <ProfileStats
            number={account.me.root?.topicsWantToLearn?.length || 0}
            label="To Learn"
          />
          <ProfileStats
            number={account.me.root?.topicsLearned?.length || 0}
            label="Learned"
          />
        </div>
      </div>
      <div className="mx-auto py-20">
        <p>Public profiles are coming soon</p>
      </div>
    </div>
  )
}
