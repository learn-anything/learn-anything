import { createSignal } from "solid-js"
import Button from "./Button"
// import Button from "../../shared/components/Button"

export default function UserBio(props: {
	bio: string
	updateBio: (bio: string) => void
}) {
	const [newBio, setNewBio] = createSignal("")
	return (
		<>
			<div>User bio: {props.bio}</div>
			<input
				style={{ color: "black" }}
				type="text"
				placeholder="Change bio"
				onChange={(e) => setNewBio(e.target.value)}
			/>
			<Button label="Testing wat" />
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
