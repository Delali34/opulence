import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const result = await query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { name, brand, price, description, image_url, rating } =
      await request.json();
    const result = await query(
      "UPDATE products SET name = $1, brand = $2, price = $3, description = $4, image_url = $5, rating = $6 WHERE id = $7 RETURNING *",
      [name, brand, price, description, image_url, rating, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const result = await query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
