// lib/db/index.js
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query:", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    console.log("Creating categories table...");
    await client.query(`
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;

      CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          slug VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating products table...");
    await client.query(`
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          description TEXT,
          image_url TEXT,
          rating DECIMAL(3, 2),
          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating indexes...");
    await client.query(`
      CREATE INDEX idx_categories_slug ON categories(slug);
      CREATE INDEX idx_products_category_id ON products(category_id);
    `);

    console.log("Inserting initial categories...");
    await client.query(`
      INSERT INTO categories (name, description, slug)
      VALUES 
          ('Neckties', 'Classic neckties for formal occasions', 'neckties'),
          ('Bow Ties', 'Elegant bow ties for special events', 'bow-ties'),
          ('Pocket Squares', 'Complementary pocket squares', 'pocket-squares');
    `);

    // Commit transaction
    await client.query("COMMIT");

    return { success: true, message: "Database initialized successfully" };
  } catch (error) {
    // Rollback in case of error
    await client.query("ROLLBACK");
    console.error("Database initialization error:", error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}
