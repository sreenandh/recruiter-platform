import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import UserRole from "@/lib/models/UserRole";
import { requireUser } from "@/lib/authz";

export async function POST() {
  const userId = await requireUser();
  await dbConnect();
  const adminExists = await UserRole.findOne({ role: "admin" });
  if (adminExists) {
    return NextResponse.json({ ok: false, message: "Admin already exists" }, { status: 400 });
  }
  await UserRole.create({ userId, role: "admin" });
  return NextResponse.json({ ok: true, role: "admin" });
}