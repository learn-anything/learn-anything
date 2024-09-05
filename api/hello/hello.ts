import { api } from "encore.dev/api"

// Welcome to Encore!
// This is a simple "Hello World" project to get you started.
//
// To run it, execute "encore run" in your favorite shell.

// ==================================================================

// This is a simple REST API that responds with a personalized greeting.
// To call it, run in your terminal:
//
//	curl http://localhost:4000/hello/World
//
export const get = api(
	{ expose: true, method: "GET", path: "/hello/:name" },
	async ({ name }: { name: string }): Promise<Response> => {
		const msg = `Hello ${name}!`
		return { message: msg }
	}
)

interface Response {
	message: string
}

// ==================================================================

// Encore comes with a built-in development dashboard for
// exploring your API, viewing documentation, debugging with
// distributed tracing, and more. Visit your API URL in the browser:
//
//     http://localhost:9400
//

// ==================================================================

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore, check out these topics in docs:
//
//    Creating services and APIs: https://encore.dev/docs/ts/primitives/services-and-apis
//    Using SQL databases: https://encore.dev/docs/ts/primitives/databases
//    Authentication: https://encore.dev/docs/ts/develop/auth
//    Using Pub/Sub: https://encore.dev/docs/ts/primitives/pubsub
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets
