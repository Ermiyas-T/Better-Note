import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { EmailVerification } from "@/components/emails/EmailVerification";

const resend = new Resend(process.env.RESEND_API_KEY!);
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema, // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        //from resend test email
        from: "Noteforge <onboarding@resend.dev>", // Use a verified domain in production
        to: user.email,
        subject: "Verify your email",
        react: EmailVerification({
          userName: user.name,
          verificationUrl: url,
        }),
      });

      if (error) {
        console.error("[auth] Failed to send verification email", error);
      }
    },
    sendOnSignIn: true,
  },
});
