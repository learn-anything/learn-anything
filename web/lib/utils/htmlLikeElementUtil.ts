import React from "react"

export type HTMLAttributes = React.HTMLAttributes<HTMLElement> & {
	[key: string]: any
}

export type HTMLLikeElement = {
	tag: keyof JSX.IntrinsicElements
	attributes?: HTMLAttributes
	children?: (HTMLLikeElement | string)[]
}

export const renderHTMLLikeElement = (element: HTMLLikeElement | string): React.ReactNode => {
	if (typeof element === "string") {
		return element
	}

	const { tag, attributes = {}, children = [] } = element

	return React.createElement(tag, attributes, ...children.map(child => renderHTMLLikeElement(child)))
}
