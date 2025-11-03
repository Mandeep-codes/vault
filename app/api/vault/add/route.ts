import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VaultItem from "@/models/VaultItem";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, title, username, password, url, notes } = await req.json();
    if (!userId || !title || !password) return NextResponse.json({ success: false, message: "missing fields" }, { status: 400 });

    const item = await VaultItem.create({ userId, title, username, password, url, notes });
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    console.error("Add vault error:", err);
    return NextResponse.json({ success: false, message: "Add error" }, { status: 500 });
  }
}

