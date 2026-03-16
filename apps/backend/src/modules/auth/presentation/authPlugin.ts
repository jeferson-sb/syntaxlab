import { Elysia } from "elysia";
import { auth, type Session } from "../infra/betterAuth";

/**
 * Better Auth plugin for Elysia.
 * Mounts auth handler and provides auth macro for protected routes.
 *
 * Usage:
 * ```ts
 * app.use(betterAuthPlugin)
 *    .get("/protected", ({ user }) => user, { auth: true })
 * ```
 */
export const betterAuthPlugin = new Elysia({ name: "module/auth/better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export type AuthUser = Session["user"];
export type AuthSession = Session["session"];
