import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Singleton MongoDB client
let globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = new MongoClient(uri);
}
const client = globalWithMongo._mongoClient;

export async function POST(req: Request) {
  try {
    const { action, email, otp, password } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const db = client.db(process.env.DB_NAME || "hirexplore");

    // 1. Check if the user exists
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Find and verify the OTP in the 'verification' collection
    // Better Auth stores it with identifier = email
    const verification = await db.collection("verification").findOne({ 
      identifier: email,
      value: otp
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Check expiration
    if (new Date(verification.expiresAt) < new Date()) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (action === "verify") {
      // OTP is valid, let the frontend proceed to the reset step
      return NextResponse.json({ success: true, message: "OTP verified" });
    } 
    else if (action === "reset") {
      if (!password || password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }

      // 3. Hash the new password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Update the account collection
      // Better auth stores the password in the 'account' collection where providerId = "credential"
      const updateResult = await db.collection("account").updateOne(
        { userId: user._id || user.id, providerId: "credential" },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          } 
        }
      );

      // If the account didn't exist (e.g. they only signed up via Google), we can't just set a password easily without creating the credential account,
      // but for standard users this will work. If updateResult.matchedCount === 0, it means no credential account exists.
      if (updateResult.matchedCount === 0) {
        // Create the credential account for them so they can now log in with email/password
        await db.collection("account").insertOne({
          id: crypto.randomUUID(),
          accountId: email,
          providerId: "credential",
          userId: user._id || user.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // 5. Delete the OTP so it can't be reused
      await db.collection("verification").deleteOne({ _id: verification._id });

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
