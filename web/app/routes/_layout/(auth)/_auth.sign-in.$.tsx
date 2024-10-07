import { SignIn } from "@clerk/tanstack-start"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/_auth/sign-in/$")({
  component: () => <SignInComponent />,
})

function SignInComponent() {
  return (
    <div className="flex justify-center py-24">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary text-primary-foreground",
            card: "shadow-none",
          },
        }}
      />
    </div>
  )
}
