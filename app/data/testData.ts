import { WebsiteElement } from "~/components/TreeItem"

export const testData: WebsiteElement[] = [
  {
    id: "1",
    name: "Home page",
    type: "page",
    url: "https://example.com",
    children: [
      {
        id: "1-1",
        name: "Header",
        type: "section",
        children: [
          { id: "1-1-1", name: "Logo", type: "image" },
          { id: "1-1-2", name: "Navigation", type: "component" },
          { id: "1-1-3", name: "Search button", type: "component" },
        ],
      },
      {
        id: "1-2",
        name: "Hero section",
        type: "section",
        children: [
          { id: "1-2-1", name: "Title", type: "component" },
          { id: "1-2-2", name: "Banner", type: "image" },
          { id: "1-2-3", name: "CTA button", type: "component" },
        ],
      },
      {
        id: "1-3",
        name: "Footer",
        type: "section",
        children: [
          { id: "1-3-1", name: "Links", type: "component" },
          { id: "1-3-2", name: "Contacts", type: "component" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Products catalog",
    type: "page",
    url: "https://example.com/products",
    children: [
      {
        id: "2-1",
        name: "Filters",
        type: "component",
      },
      {
        id: "2-2",
        name: "Products list",
        type: "component",
        children: [
          { id: "2-2-1", name: "Product card", type: "component" },
          { id: "2-2-2", name: "Pagination", type: "component" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "API Endpoints",
    type: "api",
    children: [
      { id: "3-1", name: "GET /products", type: "api", url: "/api/products" },
      {
        id: "3-2",
        name: "GET /categories",
        type: "api",
        url: "/api/categories",
      },
      { id: "3-3", name: "POST /order", type: "api", url: "/api/order" },
    ],
  },
  {
    id: "4",
    name: "Styles",
    type: "style",
    children: [
      {
        id: "4-1",
        name: "Main styles",
        type: "style",
        url: "/styles/main.css",
      },
      {
        id: "4-2",
        name: "Components",
        type: "style",
        url: "/styles/components.css",
      },
      { id: "4-3", name: "Themes", type: "style", url: "/styles/themes.css" },
    ],
  },
  {
    id: "5",
    name: "Scripts",
    type: "script",
    children: [
      { id: "5-1", name: "Main JS", type: "script", url: "/js/main.js" },
      {
        id: "5-2",
        name: "Analytics",
        type: "script",
        url: "/js/analytics.js",
      },
      { id: "5-3", name: "Utils", type: "script", url: "/js/utils.js" },
    ],
  },
]

export const elementTypes = [
  "page",
  "section",
  "component",
  "image",
  "api",
  "style",
  "script",
]

export const sortElements = (
  elements: WebsiteElement[],
  order: "asc" | "desc",
): WebsiteElement[] => {
  return elements
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return order === "asc" ? comparison : -comparison
    })
    .map((element) => {
      if (element.children && element.children.length > 0) {
        return {
          ...element,
          children: sortElements(element.children, order),
        }
      }
      return element
    })
}

export const filterElements = (
  elements: WebsiteElement[],
  type: string | null,
): WebsiteElement[] => {
  return elements
    .filter((element) => type === null || element.type === type)
    .map((element) => {
      if (element.children && element.children.length > 0) {
        const filteredChildren = filterElements(element.children, type)
        return {
          ...element,
          children: filteredChildren,
        }
      }
      return element
    })
    .filter(
      (element) =>
        type === null ||
        element.type === type ||
        (element.children && element.children.length > 0),
    )
}
