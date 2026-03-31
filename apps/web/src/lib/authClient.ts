import { createAuthClient } from "better-auth/vue"
import { config } from "./config"

export const authClient = createAuthClient({
  baseURL: config.backendUrl,
  fetchOptions: {
    credentials: "include",
  },
})

export const { signIn, signOut, useSession, getSession } = authClient
