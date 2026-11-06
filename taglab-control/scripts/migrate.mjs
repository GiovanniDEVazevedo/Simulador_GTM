import { readFile } from "node:fs/promises";
import { database } from "../lib/db.mjs";
const db = database();
try {
  await db.query(
    await readFile(new URL("../db/001-initial.sql", import.meta.url), "utf8"),
  );
  console.log("Schema da central atualizado.");
} finally {
  await db.end();
}
