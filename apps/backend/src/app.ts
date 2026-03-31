import { Elysia } from "elysia"
import { openapi, fromTypes } from "@elysiajs/openapi"
import { cors } from "@elysiajs/cors"
import { logger } from "@bogeychan/elysia-logger"

import { projectController } from "@/modules/project/presentation/http/projectController"
import { boardController } from "@/modules/board/presentation/http/boardController"
import { blockController } from "@/modules/block/presentation/http/blockController"
import { aiController } from "@/modules/ai/presentation/http/aiController"
import { createBetterAuthPlugin } from "@/modules/auth/presentation/authPlugin"

const TRUSTED_ORIGINS = [process.env.FRONTEND_URL || "http://localhost:5173"]
console.log("[CORS] FRONTEND_URL:", process.env.FRONTEND_URL)
console.log("[CORS] TRUSTED_ORIGINS:", TRUSTED_ORIGINS)

export const makeServer = () => {
  return new Elysia({ prefix: "/api" })
    .use(openapi({ references: fromTypes() }))
    .use(
      cors({
        origin: TRUSTED_ORIGINS,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    )
    .use(logger())
    .use(createBetterAuthPlugin())
    .use(projectController)
    .use(boardController)
    .use(blockController)
    .use(aiController)
}

export type App = ReturnType<typeof makeServer>
