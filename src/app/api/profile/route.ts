import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

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
    
    const profile = await db.collection("profiles").findOne({ userId: session.user.id });

    if (!profile) {
      // Return empty default profile if none exists
      return NextResponse.json({ 
        profile: {
          personalInfo: {
            name: session.user.name || "",
            email: session.user.email || "",
            phone: "",
            location: "",
            title: "",
            portfolio: "",
            github: "",
            linkedin: ""
          },
          summary: "",
          skills: [],
          experience: [],
          education: [],
          projects: [],
          certifications: []
        } 
      });
    }

    // Remove internal Mongo ID
    const { _id, ...cleanProfile } = profile;
    return NextResponse.json({ profile: cleanProfile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "hirexplore");
    
    await db.collection("profiles").updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          ...updates,
          userId: session.user.id,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
