"use client"

import { useState } from "react"
import { DemoAuth } from "jazz-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export const AuthUI: DemoAuth.Component = ({ existingUsers, logInAs, signUp, appName, loading }) => {
	const [username, setUsername] = useState<string>("")

	if (loading) return <div>Loading...</div>

	return (
		<div className="bg-background flex h-screen w-screen items-center justify-center">
			<div className="flex w-72 flex-col gap-8">
				<h1>{appName}</h1>
				<form
					className="flex w-72 flex-col gap-2"
					onSubmit={e => {
						e.preventDefault()
						signUp(username)
					}}
				>
					<Input
						placeholder="Display name"
						value={username}
						onChange={e => setUsername(e.target.value)}
						autoComplete="webauthn"
					/>
					<Button type="submit">Sign Up</Button>
				</form>

				<div className="flex flex-col gap-2">
					{existingUsers.map(user => (
						<Button key={user} onClick={() => logInAs(user)}>
							Log In as "{user}"
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}

export default AuthUI
