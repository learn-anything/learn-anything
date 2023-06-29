import * as edgedb from "edgedb"

// TODO: use auth token to get user
// get topics for a given user
export default async function GetTopicsResolver() {
  // const conn = await edgedb.connect({
  //   user: "<edgedb-cloud-username>",
  //   host: "<edgedb-cloud-host>",
  //   port: "<edgedb-cloud-port>",
  //   database: "<edgedb-cloud-database>",
  //   password: "<edgedb-cloud-password>",
  // });

  // try {
  //   console.log(await conn.queryOne("SELECT 1;"));
  // } finally {
  //   await conn.close();
  // }
  return { topic: "Physics" }
}
