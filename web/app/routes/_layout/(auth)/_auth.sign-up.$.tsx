import { SignUp } from "@clerk/tanstack-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/_auth/sign-up/$")({
  component: () => <SignUpComponent />,
})

function SignUpComponent() {
  return (
    <div className="flex justify-center py-24">
      <SignUp />
    </div>
  )
}
