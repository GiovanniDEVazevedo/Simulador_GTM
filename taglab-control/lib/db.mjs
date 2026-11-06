import pg from "pg";
let pool;
export function database() {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL não configurada.");
  return (pool ??= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  }));
}
export async function transaction(db, callback) {
  const connection = await db.connect();
  try {
    await connection.query("BEGIN");
    const value = await callback(connection);
    await connection.query("COMMIT");
    return value;
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}
