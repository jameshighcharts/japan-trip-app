import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";
import { verifyToken } from "@/src/lib/auth";

function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("notesapp");
  const notesCollection = db.collection("notes");

  const notes = await notesCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { note } = await request.json();
  if (!note || !note.trim()) {
    return NextResponse.json({ error: "Note is required" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("notesapp");
  const notesCollection = db.collection("notes");

  await notesCollection.insertOne({
    text: note,
    userId,
    createdAt: new Date(),
  });

  const notes = await notesCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

  return NextResponse.json(notes);
}
