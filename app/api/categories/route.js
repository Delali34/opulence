// app/api/categories/route.js
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        c.*,
        (
          SELECT COUNT(*) 
          FROM products 
          WHERE category_id = c.id
        ) as product_count
      FROM categories c 
      ORDER BY name ASC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, slug, image_url } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const checkSlug = await query("SELECT id FROM categories WHERE slug = $1", [
      slug,
    ]);

    if (checkSlug.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Insert with image_url
    const result = await query(
      `
      INSERT INTO categories (
        name, 
        description, 
        slug, 
        image_url,
        created_at,
        updated_at
      ) 
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING *
      `,
      [name, description, slug, image_url]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Add PUT method for updating categories
export async function PUT(request) {
  try {
    const { id, name, description, slug, image_url } = await request.json();

    // Validate required fields
    if (!id || !name || !slug) {
      return NextResponse.json(
        { success: false, error: "ID, name, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug exists for other categories
    const checkSlug = await query(
      "SELECT id FROM categories WHERE slug = $1 AND id != $2",
      [slug, id]
    );

    if (checkSlug.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      UPDATE categories 
      SET 
        name = $1, 
        description = $2, 
        slug = $3, 
        image_url = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 
      RETURNING *
      `,
      [name, description, slug, image_url, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Add DELETE method
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category has products
    const checkProducts = await query(
      "SELECT COUNT(*) FROM products WHERE category_id = $1",
      [id]
    );

    if (parseInt(checkProducts.rows[0].count) > 0) {
      // Update products to remove category reference
      await query(
        "UPDATE products SET category_id = NULL WHERE category_id = $1",
        [id]
      );
    }

    const result = await query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
