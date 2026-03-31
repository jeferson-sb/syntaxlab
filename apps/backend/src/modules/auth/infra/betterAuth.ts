import { betterAuth, type CookieOptions } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import mongoose from "mongoose"

/**
 * Create Better Auth instance with MongoDB adapter.
 * MUST be called after MongoDB connection is established.
 */

const crossSiteCookieAttributes: CookieOptions = {
  sameSite: "none",
  secure: true,
} as const

export const createAuth = () => {
  if (!mongoose.connection.db) {
    throw new Error(
      "MongoDB connection not established. Call makeMongoDBConnection() first.",
    )
  }

  return betterAuth({
    database: mongodbAdapter(mongoose.connection.db),
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
    advanced: {
      useSecureCookies: true,
      defaultCookieAttributes: crossSiteCookieAttributes,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 15, // 15 min cache
      },
    },
    account: {
      accountLinking: {
        enabled: false,
      },
    },
  })
}

export type Session = ReturnType<typeof betterAuth>["$Infer"]["Session"]
export type User = Session["user"]
