import { useEffect } from "react"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLocation } from "@tanstack/react-router"

const hasVisitedAtom = atomWithStorage("hasVisitedLearnAnything", false)
const isDialogOpenAtom = atom(true)

export function Onboarding() {
  const { pathname } = useLocation()
  const [hasVisited, setHasVisited] = useAtom(hasVisitedAtom)
  const [isOpen, setIsOpen] = useAtom(isDialogOpenAtom)

  useEffect(() => {
    if (!hasVisited && pathname !== "/") {
      setIsOpen(true)
    }
  }, [hasVisited, pathname, setIsOpen])

  const handleClose = () => {
    setIsOpen(false)
    setHasVisited(true)
  }

  if (hasVisited) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Learn Anything!</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription asChild>
          <div className="space-y-4 text-base leading-5 text-foreground/70">
            <p>
              Learn Anything is a learning platform that organizes knowledge in
              a social way. You can create pages, add links, track learning
              status of any topic, and more things in the future.
            </p>
            <p>
              Try do these quick onboarding steps to get a feel for the product:
            </p>
            <ul className="list-inside list-disc">
              <li>Create your first page</li>
              <li>Add a link to a resource</li>
              <li>Update your learning status on a topic</li>
            </ul>
            <p>
              If you have any questions, don't hesitate to reach out. Click on
              question mark button in the bottom right corner and enter your
              message.
            </p>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
          <AlertDialogAction onClick={handleClose}>
            Get Started
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Onboarding
