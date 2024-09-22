import { Command } from "@effect/cli"
import { BunContext } from "@effect/platform-bun"
import { Console, Effect } from "effect"

const command = Command.make("test", {}, () => Console.log("test"))

const cli = Command.run(command, {
	name: "learn-anything.xyz CLI",
	version: "v0.0.1"
})

Effect.runPromise(cli(process.argv).pipe(Effect.provide(BunContext.layer)))
