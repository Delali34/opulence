// app/api/init-db/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

async function initializeDatabase() {
  try {
    // Drop existing tables
    console.log("Dropping existing tables...");
    await query(`
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
    `);

    // Create categories table with image_url
    console.log("Creating categories table...");
    await query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) NOT NULL UNIQUE,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    console.log("Creating products table...");
    await query(`
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
      )
    `);

    // Create indexes
    console.log("Creating indexes...");
    await query(`
      CREATE INDEX idx_categories_slug ON categories(slug);
      CREATE INDEX idx_products_category_id ON products(category_id);
    `);

    // Insert sample categories
    console.log("Adding sample categories...");
    await query(`
      INSERT INTO categories (name, description, slug, image_url)
      VALUES 
        ('Neckties', 'Classic neckties for formal occasions', 'neckties', NULL),
        ('Bow Ties', 'Elegant bow ties for special events', 'bow-ties', NULL),
        ('Pocket Squares', 'Complementary pocket squares', 'pocket-squares', NULL)
    `);

    return { success: true, message: "Database initialized successfully" };
  } catch (error) {
    console.error("Database initialization error:", error);
    return { success: false, error: error.message };
  }
}

export async function POST() {
  try {
    const result = await initializeDatabase();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if tables exist
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      return NextResponse.json({
        success: false,
        error: "Database not initialized. Please make a POST request first.",
      });
    }

    // Get table information
    const tables = await query(`
      SELECT 
        table_name,
        (
          SELECT json_agg(column_name)
          FROM information_schema.columns
          WHERE table_name = t.table_name
        ) as columns,
        (
          SELECT COUNT(*) 
          FROM information_schema.columns 
          WHERE table_name = t.table_name
        ) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_name IN ('categories', 'products');
    `);

    // Get record counts
    const categoriesCount = await query("SELECT COUNT(*) FROM categories");
    const productsCount = await query("SELECT COUNT(*) FROM products");

    // Get sample data
    const sampleCategories = await query("SELECT * FROM categories LIMIT 3");
    const sampleProducts = await query("SELECT * FROM products LIMIT 3");

    return NextResponse.json({
      success: true,
      schema: {
        tables: tables.rows,
        counts: {
          categories: parseInt(categoriesCount.rows[0].count),
          products: parseInt(productsCount.rows[0].count),
        },
        samples: {
          categories: sampleCategories.rows,
          products: sampleProducts.rows,
        },
      },
    });
  } catch (error) {
    console.error("GET route error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
