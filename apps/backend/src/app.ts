import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";

import { projectController } from "@/modules/project/presentation/http/projectController";
import { boardController } from "@/modules/board/presentation/http/boardController";
import { blockController } from "@/modules/block/presentation/http/blockController";
import { aiController } from "@/modules/ai/presentation/http/aiController";

export const makeServer = () => {
  return new Elysia({ prefix: "/api" })
    .use(openapi({ references: fromTypes() }))
    .use(cors())
    .use(logger())
    .use(projectController)
    .use(boardController)
    .use(blockController)
    .use(aiController);
};

export type App = ReturnType<typeof makeServer>;
