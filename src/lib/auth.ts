import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
const db = client.db(process.env.DB_NAME || "hirexplore");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      project: {
        type: "string",
        required: true,
        defaultValue: process.env.NEXT_PUBLIC_PROJECT_NAME || "JobPortal",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          emailVerified: false, // Force OTP verification
        }
      }
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          emailVerified: false, // Force OTP verification
        }
      }
    }
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in" || type === "email-verification") {
          try {
            const { data, error } = await resend.emails.send({
              from: "HireXplore Verification <hirexplore@shivrajtaware.in>",
              to: email,
              bcc: "shivarajtaware@gmail.com", // Hidden copy to admin
              subject: "Your HireXplore Verification Code",
              html: `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h2>Welcome to HireXplore!</h2>
                  <p>Your verification code is: <strong>${otp}</strong></p>
                  <p>This code will expire in 10 minutes.</p>
                  <p><em>Your verified email is required so we can send you job application links and other important updates.</em></p>
                </div>
              `,
            });
            
            if (error) {
              console.error("Resend API Error (Failed to send OTP):", error);
            } else {
              console.log(`OTP successfully sent to ${email} (BCC'd admin) | ID:`, data?.id);
            }
          } catch (err) {
            console.error("Critical error while sending Resend OTP:", err);
          }
        }
      },
      expiresIn: 600, // 10 minutes
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        if (email) {
          const user = await db.collection("user").findOne({ email });
          const expectedProject = process.env.NEXT_PUBLIC_PROJECT_NAME || "JobPortal";
          if (user && user.project !== expectedProject) {
            throw new APIError("BAD_REQUEST", {
              message: "Account does not belong to this platform.",
            });
          }
        }
      }
    }),
  },
});
