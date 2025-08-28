import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import UserRole from "@/lib/models/UserRole";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin"]);
  await dbConnect();
  const list = await UserRole.find({}).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  await requireRole(["admin"]);
  await dbConnect();
  const { userId, role } = await req.json();
  if (!userId || !["admin", "recruiter"].includes(role)) {
    return NextResponse.json({ error: "userId and valid role required" }, { status: 400 });
  }
  const rec = await UserRole.findOneAndUpdate({ userId }, { role }, { upsert: true, new: true });
  return NextResponse.json(rec);
}