// app/api/products/route.js
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

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

    const result = await query(sql, params);

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
