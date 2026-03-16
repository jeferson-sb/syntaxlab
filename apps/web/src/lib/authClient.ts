import { createAuthClient } from "better-auth/vue";
import { config } from "./config";

export const authClient = createAuthClient({
  baseURL: config.backendUrl,
});

export const { signIn, signOut, useSession, getSession } = authClient;
