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

    const job = await req.json();
    if (!job || !job.id) {
      return NextResponse.json({ error: "Invalid job data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    // Save job, replacing if it already exists for this user
    await db.collection("saved_jobs").updateOne(
      { userId: session.user.id, id: job.id },
      { $set: { ...job, userId: session.user.id, savedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save job error:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
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
    
    const savedJobs = await db.collection("saved_jobs")
      .find({ userId: session.user.id })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json({ jobs: savedJobs });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return NextResponse.json({ error: "Failed to get saved jobs" }, { status: 500 });
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

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    await db.collection("saved_jobs").deleteOne({ 
      userId: session.user.id, 
      id: jobId 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete saved job error:", error);
    return NextResponse.json({ error: "Failed to delete saved job" }, { status: 500 });
  }
}
