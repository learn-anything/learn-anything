import { client } from "./client"

export interface User {
  name: string
  email: string
}

export async function addUser(user: User) {
  const res = await client.query(`
  insert User {
    name := '${user.name}',
    email := '${user.email}'
  }`)
  console.log(res)
}

export async function deleteUser(id: string) {
  const res = await client.query(`
  delete User
  filter .id = <uuid>'${id}'`)
  console.log(res)
}

export async function getUsers() {
  const res = await client.query(`
  select User {
    name,
    email,
    id
  }`)
  console.log(res)
}
