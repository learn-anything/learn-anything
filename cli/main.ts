import { Command } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Console, Effect } from "effect"

// Define the top-level command
const command = Command.make("hello-world", {}, () => Console.log("Hello World"))

// Set up the CLI application
const cli = Command.run(command, {
	name: "Hello World CLI",
	version: "v1.0.0"
})

// Prepare and run the CLI application
cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
