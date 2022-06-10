import { DB } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";

function initDb() {
  const db = new DB("la.db");
  db.query(`
  CREATE TABLE links (
    link_id integer PRIMARY KEY AUTOINCREMENT,
    title text NOT NULL,
    url text NOT NULL
  );
`);
  db.close();
}
