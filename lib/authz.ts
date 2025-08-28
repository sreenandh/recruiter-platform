import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/db";
import UserRole from "@/lib/models/UserRole";

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return userId;
}

export async function requireRole(roles: ("admin" | "recruiter")[]) {
  const userId = await requireUser();
  await dbConnect();
  const record = await UserRole.findOne({ userId });
  if (!record || !roles.includes(record.role)) throw new Response("Forbidden", { status: 403 });
  return { userId, role: record.role as "admin" | "recruiter" };
}