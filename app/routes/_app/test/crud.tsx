import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAccount, useIsAuthenticated } from "jazz-react"
import { ListOfUrls, Website } from "~/jazz-schema"
import { useForm } from "@tanstack/react-form"

function RouteComponent() {
  const { me } = useAccount({ profile: {}, root: { websites: [{}] } })
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      websiteName: "",
      websiteUrl: "",
    },
    onSubmit: async ({ value }) => {
      if (me) {
        const newWebsite = Website.create(
          {
            name: value.websiteName,
            url: value.websiteUrl,
            urls: ListOfUrls.create([]),
          },
          { owner: me },
        )
        me.root.websites.push(newWebsite)
      }
    },
  })

  if (!isAuthenticated) {
    navigate({ to: "/test" })
  }
  console.log(me, "me")

  if (!me) return <></>
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full max-w-2xl mx-auto p-5">
      <main className="container flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Website CRUD Operations</h1>
        <div className="flex flex-col gap-4">
          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-3">Create Website</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="flex gap-4 items-end"
            >
              <div className="flex flex-col gap-1 flex-grow">
                <form.Field
                  name="websiteName"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? "Website name is required" : undefined,
                  }}
                >
                  {(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Website Name
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        placeholder="My Website"
                      />
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length ? (
                        <em className="text-red-500 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </em>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="flex flex-col gap-1 flex-grow">
                <form.Field
                  name="websiteUrl"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Website URL is required"
                        : !/^https?:\/\/.+/.test(value)
                          ? "Must be a valid URL starting with http:// or https://"
                          : undefined,
                  }}
                >
                  {(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Website URL
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        placeholder="https://example.com"
                      />
                      {field.state.meta.isTouched &&
                      field.state.meta.errors.length ? (
                        <em className="text-red-500 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </em>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`px-4 py-2 rounded-md text-white ${
                      canSubmit
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "Creating..." : "Create Website"}
                  </button>
                )}
              </form.Subscribe>
            </form>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-3">Your Websites</h2>
            <div className="flex flex-col gap-2">
              {me?.root.websites.map((website, index) => (
                <div
                  key={index}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{website.name}</h3>
                    <p className="text-sm text-gray-600">{website.url}</p>
                  </div>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    onClick={() => {
                      me?.root.websites.splice(index, 1)
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {me.root.websites.length === 0 && (
                <p className="text-gray-500 italic">
                  No websites yet. Create one above!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const Route = createFileRoute("/_app/test/crud")({
  component: RouteComponent,
})
