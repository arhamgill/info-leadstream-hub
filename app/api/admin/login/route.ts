import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not found in environment variables");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
