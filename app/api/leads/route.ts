import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const { markets, agentType, firstName, lastName, email, phone, consent } =
      body;

    if (
      !markets ||
      !agentType ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !consent
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create new lead
    const lead = await Lead.create({
      markets,
      agentType,
      agencySize: body.agencySize || null,
      firstName,
      lastName,
      email,
      phone,
      consent,
      status: "new",
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 },
    );
  }
}

// GET /api/leads - Get all leads (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build query
    const query = status && status !== "all" ? { status } : {};

    // Fetch leads, sorted by most recent first
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    // Transform leads to match frontend interface
    const transformedLeads = leads.map((lead) => ({
      id: lead._id.toString(),
      markets: lead.markets,
      agentType: lead.agentType,
      agencySize: lead.agencySize || null,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      createdAt: lead.createdAt,
    }));

    return NextResponse.json(
      { success: true, leads: transformedLeads },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
