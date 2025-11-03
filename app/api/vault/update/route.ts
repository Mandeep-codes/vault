import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VaultItem from "@/models/VaultItem";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    // expects body._id (or id)
    const id = body._id || body.id;
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });

    const updated = await VaultItem.findByIdAndUpdate(id, {
      title: body.title,
      username: body.username,
      password: body.password,
      url: body.url,
      notes: body.notes
    }, { new: true });

    if (!updated) return NextResponse.json({ success: false, message: "not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ success: false, message: "Update error" }, { status: 500 });
  }
}


