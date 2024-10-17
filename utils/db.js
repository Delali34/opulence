import { Pool } from "@neondatabase/serverless";

let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getClient() {
  return await pool.connect();
}
