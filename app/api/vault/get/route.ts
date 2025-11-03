import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VaultItem from "@/models/VaultItem";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const items = await VaultItem.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error("Get vault error:", err);
    return NextResponse.json({ success: false, message: "Get error" }, { status: 500 });
  }
}

