import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Match from "@/lib/models/Match";
import { requireRole } from "@/lib/authz";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  await requireRole(["admin"]);
  await dbConnect();
  const doc = await Match.findByIdAndUpdate(params.id, { status: "rejected" }, { new: true });
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(doc);
}