import { createSignal } from "solid-js"

export default function UserBio(props: {
	bio: string
	updateBio: (bio: string) => void
}) {
	const [newBio, setNewBio] = createSignal("")
	return (
		<>
			<div>User bio: {props.bio}</div>
			<input
				type="text"
				placeholder="Change bio"
				onChange={(e) => setNewBio(e.target.value)}
			/>
			<button
				onClick={() => {
					console.log(newBio(), "new bio")
					props.updateBio(newBio())
				}}
			>
				Update bio
			</button>
		</>
	)
}
