import { CoMap, CoList, co, Group, ID, Account } from "jazz-tools"
import { Encoders } from "jazz-tools"

// Slug manager to ensure uniqueness per model
class SlugManager {
	private static instances: Map<string, Set<string>> = new Map()

	static getUniqueSlug(modelName: string, slugBase: string): string {
		if (!this.instances.has(modelName)) {
			this.instances.set(modelName, new Set())
		}
		const slugs = this.instances.get(modelName)!
		let slug = slugBase
		let counter = 1
		while (slugs.has(slug)) {
			slug = `${slugBase}-${counter}`
			counter++
		}
		slugs.add(slug)
		return slug
	}
}

// Base model for all our data types
class BaseModel extends CoMap {
	createdAt = co.encoded(Encoders.Date)
	updatedAt = co.encoded(Encoders.Date)
}

// Todo model
class Todo extends BaseModel {
	text = co.string
	completed = co.boolean
	slug = co.string
}

// User model (without slug)
class User extends BaseModel {
	name = co.string
	email = co.string
}

// Project model (with slug)
class Project extends BaseModel {
	name = co.string
	description = co.string
	slug = co.string
}

// Generic List model
class List<T extends BaseModel> extends CoList<T> {}

// Specific list types
class TodoList extends List<Todo> {}
class UserList extends List<User> {}
class ProjectList extends List<Project> {}

// Factory functions for creating models
function createTodo(data: { text: string; completed?: boolean }, owner: Account | Group): Todo {
	const now = new Date()
	const slug = SlugManager.getUniqueSlug(
		"Todo",
		data.text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.slice(0, 20)
	)
	return Todo.create(
		{
			text: data.text,
			completed: data.completed ?? false,
			slug,
			createdAt: now,
			updatedAt: now
		},
		{ owner }
	)
}

function createUser(data: { name: string; email: string }, owner: Account | Group): User {
	const now = new Date()
	return User.create(
		{
			...data,
			createdAt: now,
			updatedAt: now
		},
		{ owner }
	)
}

function createProject(data: { name: string; description: string }, owner: Account | Group): Project {
	const now = new Date()
	const slug = SlugManager.getUniqueSlug(
		"Project",
		data.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.slice(0, 20)
	)
	return Project.create(
		{
			...data,
			slug,
			createdAt: now,
			updatedAt: now
		},
		{ owner }
	)
}

// Factory functions for creating lists
function createTodoList(owner: Account | Group): TodoList {
	return TodoList.create([], { owner })
}

function createUserList(owner: Account | Group): UserList {
	return UserList.create([], { owner })
}

function createProjectList(owner: Account | Group): ProjectList {
	return ProjectList.create([], { owner })
}

// Helper functions for list operations
function addToList<T extends BaseModel>(list: List<T>, item: T): void {
	list.push(item)
}

function removeFromList<T extends BaseModel>(list: List<T>, id: ID<T>): void {
	const index = list.findIndex(item => item.id === id)
	if (index !== -1) {
		list.splice(index, 1)
	}
}

function updateInList<T extends BaseModel>(list: List<T>, id: ID<T>, data: Partial<T>): void {
	const item = list.find(item => item.id === id)
	if (item) {
		Object.assign(item, data, { updatedAt: new Date() })
	}
}

function getFromList<T extends BaseModel>(list: List<T>, id: ID<T>): T | undefined {
	return list.find(item => item.id === id)
}

export {
	Todo,
	User,
	Project,
	TodoList,
	UserList,
	ProjectList,
	createTodo,
	createUser,
	createProject,
	createTodoList,
	createUserList,
	createProjectList,
	addToList,
	removeFromList,
	updateInList,
	getFromList
}
