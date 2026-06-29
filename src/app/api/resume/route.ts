import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    // Save resume, replacing if it already exists for this user
    await db.collection("resumes").updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          userId: session.user.id, 
          fileName: file.name,
          fileType: file.type,
          data: base64Data,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, fileName: file.name });
  } catch (error) {
    console.error("Save resume error:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    const savedResume = await db.collection("resumes").findOne({ userId: session.user.id });

    if (!savedResume) {
      return NextResponse.json({ resume: null });
    }

    return NextResponse.json({ 
      resume: {
        fileName: savedResume.fileName,
        fileType: savedResume.fileType,
        data: savedResume.data, // base64 string
        updatedAt: savedResume.updatedAt
      } 
    });
  } catch (error) {
    console.error("Get saved resume error:", error);
    return NextResponse.json({ error: "Failed to get saved resume" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    await db.collection("resumes").deleteOne({ userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete resume error:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
