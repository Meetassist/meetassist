import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { PrismaClient } from "./generated/prisma/client";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
if (!process.env.BETTER_AUTH_URL || !process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_URL and BETTER_AUTH_SECRET environment variables are required");
}

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.MICROSOFT_CLIENT_ID ||
  !process.env.MICROSOFT_CLIENT_SECRET
) {
  throw new Error("All OAuth client IDs and secrets are required");
}


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: true,
      },
    },
  },
  plugins: [lastLoginMethod({ storeInDatabase: true }), nextCookies()],
});
