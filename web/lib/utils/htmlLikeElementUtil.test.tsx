import React from "react"
import { render } from "@testing-library/react"
import { HTMLLikeElement, renderHTMLLikeElement } from "./htmlLikeElementUtil"

const HTMLLikeRenderer: React.FC<{ content: HTMLLikeElement | string }> = ({ content }) => {
	return <>{renderHTMLLikeElement(content)}</>
}

describe("HTML-like Element Utility", () => {
	test("HTMLLikeRenderer renders simple string content", () => {
		const { getByText } = render(<HTMLLikeRenderer content="Hello, World!" />)
		expect(getByText("Hello, World!")).toBeTruthy()
	})

	test("HTMLLikeRenderer renders HTML-like structure", () => {
		const content: HTMLLikeElement = {
			tag: "div",
			attributes: { className: "test-class" },
			children: ["Hello, ", { tag: "strong", children: ["World"] }, "!"]
		}
		const { container, getByText } = render(<HTMLLikeRenderer content={content} />)
		expect(container.firstChild).toHaveProperty("className", "test-class")
		const strongElement = getByText("World")
		expect(strongElement.tagName.toLowerCase()).toBe("strong")
	})

	test("HTMLLikeRenderer handles multiple attributes", () => {
		const content: HTMLLikeElement = {
			tag: "div",
			attributes: {
				className: "test-class",
				id: "test-id",
				"data-testid": "custom-element",
				style: { color: "red", fontSize: "16px" }
			},
			children: ["Test Content"]
		}
		const { getByTestId } = render(<HTMLLikeRenderer content={content} />)
		const element = getByTestId("custom-element")
		expect(element.className).toBe("test-class")
		expect(element.id).toBe("test-id")
		expect(element.style.color).toBe("red")
		expect(element.style.fontSize).toBe("16px")
	})
})
