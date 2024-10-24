// app/api/categories/[id]/route.js
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, slug, image_url } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
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

    // Update the category
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

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // First check if category exists
    const categoryCheck = await query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Start transaction
    await query("BEGIN");

    try {
      // Update any products that use this category
      await query(
        "UPDATE products SET category_id = NULL WHERE category_id = $1",
        [id]
      );

      // Delete the category
      const result = await query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
      );

      // Commit transaction
      await query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Category deleted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      // Rollback transaction on error
      await query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      `
      SELECT c.*,
        (
          SELECT COUNT(*) 
          FROM products 
          WHERE category_id = c.id
        ) as product_count
      FROM categories c
      WHERE c.id = $1
    `,
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
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
