import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface User {
  name: string
  email: string
}

export async function addUser(user: User) {
  const res = await e.insert(e.User, {
    name: user.name,
    email: user.email,
  })
  console.log(res)
  return res
}

export async function deleteUser(id: string) {
  const res = await client.query(`
  delete User
  filter .id = <uuid>'${id}'`)
  console.log(res)
  return res
}

export async function getUsers() {
  const res = await client.query(`
  select User {
    name,
    email,
    id
  }`)
  console.log(res)
  return res
}

export async function getUserIdByName(name: string) {
  const res = await client.querySingle<User>(
    `
    select User {
      name
    } filter .name = <str>$name;
    `,
    {
      name,
    }
  )
  // const res = await client.query(
  //   `
  // SELECT User {
  //   id
  // }
  // FILTER .name = <str>$name;
  // `,
  //   {
  //     name,
  //   }
  // )
  console.log(res)
  return res
}
