import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";
import mongoose from "mongoose";

// PATCH /api/leads/[id] - Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = [
      "new",
      "contacted",
      "qualified",
      "closed",
      "rejected",
    ];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Update lead
    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, lead }, { status: 200 });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 },
    );
  }
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID" },
        { status: 400 },
      );
    }

    // Delete lead
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Lead deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 },
    );
  }
}
