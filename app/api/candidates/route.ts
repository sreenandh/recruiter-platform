import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Candidate from "@/lib/models/Candidate";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin", "recruiter"]);
  await dbConnect();
  const list = await Candidate.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const { userId } = await requireRole(["admin"]);
  await dbConnect();
  const body = await req.json();
  const doc = await Candidate.create({ ...body, createdBy: userId });
  return NextResponse.json(doc, { status: 201 });
}