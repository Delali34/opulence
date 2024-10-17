import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM products");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, brand, price, description, image_url, rating } =
      await request.json();
    const result = await query(
      "INSERT INTO products (name, brand, price, description, image_url, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, brand, price, description, image_url, rating]
    );
    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
