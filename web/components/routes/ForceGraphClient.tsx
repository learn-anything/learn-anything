"use client"

export type ConnectionItem = {
	key:         string,
	title:       string,
	connections: string[],
}

export type ForceGraphClientProps = {
	items: ConnectionItem[],
}

export default function ForceGraphClient(props: ForceGraphClientProps) {
	return <code><pre>{JSON.stringify(props.items, null, 4)}</pre></code>
}