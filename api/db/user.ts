import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface User {
  name: string
  email: string
}

export async function addUser(user: User) {
  const res = await e
    .insert(e.User, {
      name: user.name,
      email: user.email,
    })
    .run(client)
  console.log(res)
  return res
}

export async function deleteUser(id: string) {
  const res = await e
    .delete(e.User, (user) => ({
      filter: e.op(user.id, "=", id),
    }))
    .run(client)
  console.log(res)
  return res
}

export async function getUsers() {
  const res = await e
    .select(e.User, () => ({
      name: true,
      email: true,
      id: true,
    }))
    .run(client)
  console.log(res)
  return res
}

export async function getUserIdByName(name: string) {
  const res = await e
    .select(e.User, (user) => ({
      id: true,
      filter: e.op(user.name, "ilike", name),
    }))
    .run(client)
  return res[0].id
}
