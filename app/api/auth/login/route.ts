import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ success: false, message: "email/password required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Login error" }, { status: 500 });
  }
}

