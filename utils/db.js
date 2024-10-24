// utils/db.js
import { Pool } from "pg";

let pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} catch (error) {
  console.error("Failed to create pool:", error);
  throw error;
}

export async function query(text, params = []) {
  console.log("Starting query execution:", { text, params });

  const client = await pool.connect();
  try {
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;

    console.log("Query executed successfully:", {
      text,
      duration,
      rowCount: res.rowCount,
      firstRow: res.rows[0] ? "✓" : "✗",
    });

    return res;
  } catch (error) {
    console.error("Database query error:", {
      text,
      params,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  } finally {
    client.release();
  }
}

export async function testConnection() {
  console.log("Testing database connection...");
  try {
    const client = await pool.connect();
    console.log("Successfully connected to database");

    const result = await client.query("SELECT NOW()");
    console.log("Test query successful:", result.rows[0]);

    client.release();
    return result.rows[0];
  } catch (error) {
    console.error("Database connection test failed:", {
      error: error.message,
      stack: error.stack,
      config: {
        host:
          process.env.DATABASE_URL?.split("@")[1]?.split(":")[0] || "unknown",
        database: process.env.DATABASE_URL?.split("/")?.pop() || "unknown",
        ssl: true,
      },
    });
    throw error;
  }
}
