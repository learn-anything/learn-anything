import { DB } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";

function saveLink(url: string, title: string) {
  const db = new DB("la.db");
  db.query(`
  INSERT INTO
    links
  VALUES
    (null, 'test 1', 'test 1')
  `);

  db.close();
}
