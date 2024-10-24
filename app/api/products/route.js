// app/api/products/route.js
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

// GET all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");

    let sql = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const params = [];
    if (categoryId) {
      sql += " WHERE p.category_id = $1";
      params.push(categoryId);
    }

    sql += " ORDER BY p.created_at DESC";

    console.log("Executing query:", { sql, params });
    const result = await query(sql, params);
    console.log(`Found ${result.rows.length} products`);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received product data:", body);

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Format price and rating to ensure they're numbers
    const price = parseFloat(body.price);
    const rating = body.rating ? parseFloat(body.rating) : null;

    if (isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Invalid price format" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      INSERT INTO products (
        name,
        brand,
        price,
        description,
        image_url,
        rating,
        category_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        body.name,
        body.brand || null,
        price,
        body.description || null,
        body.image_url || null,
        rating,
        body.category_id || null,
      ]
    );

    // Get the category name for the created product
    const productWithCategory = await query(
      `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
      `,
      [result.rows[0].id]
    );

    return NextResponse.json(
      {
        success: true,
        data: productWithCategory.rows[0],
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request) {
  try {
    const body = await request.json();
    console.log("Updating product:", body);

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate and format price and rating
    const price = parseFloat(body.price);
    const rating = body.rating ? parseFloat(body.rating) : null;

    if (isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Invalid price format" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      UPDATE products
      SET 
        name = $1,
        brand = $2,
        price = $3,
        description = $4,
        image_url = $5,
        rating = $6,
        category_id = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
      `,
      [
        body.name,
        body.brand || null,
        price,
        body.description || null,
        body.image_url || null,
        rating,
        body.category_id || null,
        body.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Get the updated product with category name
    const productWithCategory = await query(
      `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
      `,
      [result.rows[0].id]
    );

    return NextResponse.json({
      success: true,
      data: productWithCategory.rows[0],
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
