import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VaultItem from "@/models/VaultItem";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });

    await VaultItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ success: false, message: "Delete error" }, { status: 500 });
  }
}

