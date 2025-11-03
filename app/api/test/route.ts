import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: "MongoDB connected!" });
  } catch (err) {
    console.error("Mongo test failed:", err);
    return NextResponse.json({ success: false, message: "MongoDB error" }, { status: 500 });
  }
}


