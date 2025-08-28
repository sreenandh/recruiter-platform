import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs"; // ensure Node runtime on serverless hosts

export async function POST(req: Request) {
  const data = await req.arrayBuffer();
  const buffer = Buffer.from(data);
  const result = await pdf(buffer);
  return NextResponse.json({ text: result.text });
}