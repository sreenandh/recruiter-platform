import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Role from "@/lib/models/Role";
import Candidate from "@/lib/models/Candidate";
import { requireRole } from "@/lib/authz";
import { basicMatchScore } from "@/lib/match";

export async function GET(req: Request) {
  await requireRole(["admin", "recruiter"]);
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const roleId = searchParams.get("roleId");
  if (!roleId) return NextResponse.json({ error: "roleId required" }, { status: 400 });

  const role = await Role.findById(roleId).lean();
  if (!role) return NextResponse.json({ error: "role not found" }, { status: 404 });

  const candidates = await Candidate.find({}).lean();
  const results = candidates
    .map((c) => {
      const score = basicMatchScore(role.requiredSkills || [], c.skills || []);
      const missingSkills = (role.requiredSkills || []).filter(
        (s: string) => !(c.skills || []).map((x: string) => x.toLowerCase()).includes(s.toLowerCase())
      );
      return {
        candidateId: c._id,
        name: c.name,
        score,
        missingSkills,
      };
    })
    .sort((a, b) => b.score - a.score);

  return NextResponse.json(results);
}