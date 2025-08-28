import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Match from "@/lib/models/Match";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["admin", "recruiter"]);
  await dbConnect();
  const list = await Match.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const { userId, role } = await requireRole(["admin", "recruiter"]);
  await dbConnect();
  const body = await req.json();
  const { candidateId, roleId, score = 0, missingSkills = [], notes = "" } = body || {};
  if (!candidateId || !roleId) {
    return NextResponse.json({ error: "candidateId and roleId required" }, { status: 400 });
  }
  const suggestedBy = role === "recruiter" ? "recruiter" : "ai";
  const doc = await Match.create({
    candidateId,
    roleId,
    suggestedBy,
    status: "suggested",
    score,
    missingSkills,
    notes,
    createdBy: userId,
  });
  return NextResponse.json(doc, { status: 201 });
}