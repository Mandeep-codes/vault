import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ success: false, message: "email/password required" }, { status: 400 });

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ success: false, message: "User exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const u = await User.create({ email, password: hashed });
    return NextResponse.json({ success: true, userId: u._id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ success: false, message: "Signup error" }, { status: 500 });
  }
}

