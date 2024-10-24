// app/api/categories/bySlug/[slug]/route.js
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET(request, { params }) {
  console.log("Category bySlug API called with params:", params);

  try {
    const { slug } = params;

    if (!slug) {
      console.error("No slug provided");
      return NextResponse.json(
        { success: false, error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // First get the category
    console.log("Fetching category with slug:", slug);
    const categoryResult = await query(
      `SELECT * FROM categories WHERE slug = $1`,
      [slug]
    );

    if (categoryResult.rows.length === 0) {
      console.log(`No category found for slug: ${slug}`);
      return NextResponse.json(
        {
          success: false,
          error: `Category not found: ${slug}`,
        },
        { status: 404 }
      );
    }

    const category = categoryResult.rows[0];
    console.log("Category found:", category.id);

    // Then get the products
    console.log("Fetching products for category:", category.id);
    const productsResult = await query(
      `
      SELECT 
        id,
        name,
        brand,
        price,
        description,
        image_url,
        rating,
        created_at,
        updated_at
      FROM products 
      WHERE category_id = $1
      ORDER BY created_at DESC
      `,
      [category.id]
    );

    console.log(`Found ${productsResult.rows.length} products`);

    const response = {
      success: true,
      data: {
        ...category,
        products: productsResult.rows,
      },
    };

    // Log successful response
    console.log("Sending successful response");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in category/bySlug API:", {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching category",
      },
      { status: 500 }
    );
  }
}
