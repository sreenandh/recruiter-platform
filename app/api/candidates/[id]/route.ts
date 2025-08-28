import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Candidate from "@/lib/models/Candidate";
import { requireRole } from "@/lib/authz";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await requireRole(["admin"]);
  await dbConnect();
  const body = await req.json();
  const doc = await Candidate.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(doc);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await requireRole(["admin"]);
  await dbConnect();
  await Candidate.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}