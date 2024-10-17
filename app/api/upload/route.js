import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { data } = await request.json();
    const uploadResponse = await cloudinary.uploader.upload(data, {
      upload_preset: "ml_default",
    });
    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (err) {
    return NextResponse.json({ err: "Something went wrong" }, { status: 500 });
  }
}
