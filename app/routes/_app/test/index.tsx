import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAccount, useIsAuthenticated } from "jazz-react"
import { AuthButton } from "~/components/AuthButton"

function RouteComponent() {
  const { me } = useAccount({ profile: {}, root: { websites: [{}] } })
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      username: me?.profile?.name || "",
    },
    onSubmit: async ({ value }) => {
      if (me?.profile) {
        me.profile.name = value.username
      }
      console.log("Username updated to:", value.username)
    },
  })
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full max-w-2xl mx-auto p-5">
      <header>
        <nav className="container flex flex-row gap-4 justify-between items-center py-3">
          <AuthButton />
        </nav>
      </header>
      <main className="container flex flex-col gap-8">
        <div className="text-center">
          <pre className="text-left text-sm inline-block bg-white/50 p-4 rounded-lg overflow-auto max-w-full">
            {JSON.stringify(me?.root.toJSON())}
          </pre>
        </div>
        <div>
          <div className="bg-white/5 rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Welcome, {me?.profile?.name || "User"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <form.Field
                  name="username"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Username is required"
                        : value.length < 3
                          ? "Username must be at least 3 characters"
                          : undefined,
                  }}
                  children={(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length ? (
                        <em className="text-red-500 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </em>
                      ) : null}
                    </>
                  )}
                />
              </div>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      canSubmit
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Update"}
                  </button>
                )}
              />
            </form>
          </div>
        </div>
        {isAuthenticated && (
          <div className="text-center">
            <button
              className="py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate({ to: "/test/crud" })}
            >
              CRUD
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export const Route = createFileRoute("/_app/test/")({
  component: RouteComponent,
})
