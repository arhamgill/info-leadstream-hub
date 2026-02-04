import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import crypto from "crypto";

// POST /api/reviews - Upload image to Cloudinary and save URL
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Upload to Cloudinary with signature
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64Image}`;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Create signature
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha256")
      .update(stringToSign)
      .digest("hex");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formDataCloudinary = new FormData();
    formDataCloudinary.append("file", dataURI);
    formDataCloudinary.append("timestamp", timestamp.toString());
    formDataCloudinary.append("api_key", apiKey!);
    formDataCloudinary.append("signature", signature);

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formDataCloudinary,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error("Cloudinary upload failed:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to upload to Cloudinary: ${errorText}`,
        },
        { status: 500 },
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // Get the highest order number and add 1
    const highestOrder = await Review.findOne()
      .sort({ order: -1 })
      .select("order");
    const newOrder = highestOrder ? highestOrder.order + 1 : 0;

    // Save URL to database
    const review = await Review.create({
      url: cloudinaryData.secure_url,
      order: newOrder,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Error uploading review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload review" },
      { status: 500 },
    );
  }
}

// GET /api/reviews - Get all reviews sorted by order
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const reviews = await Review.find().sort({ order: 1 }).lean();

    const transformedReviews = reviews.map((review) => ({
      id: review._id.toString(),
      url: review.url,
      order: review.order,
      createdAt: review.createdAt,
    }));

    return NextResponse.json(
      { success: true, reviews: transformedReviews },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
