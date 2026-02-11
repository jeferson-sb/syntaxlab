import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";

import { projectController } from "@/modules/project/presentation/http/projectController";
import { boardController } from "@/modules/board/presentation/http/boardController";
import { blockController } from "@/modules/block/presentation/http/blockController";
import { makeMongoDBConnection } from "@/bootstrap/db";
import { config } from "@/shared/infra/config";

// type Result = {};
// type Either = {};

const makeServer = () => {
  const server = new Elysia({ prefix: "/api" })
    .use(openapi({ references: fromTypes() }))
    .use(cors())
    .use(logger())
    .use(projectController)
    .use(boardController)
    .use(blockController);

  return server;
};

makeMongoDBConnection();

export const server = makeServer();

server.listen(config.serverPort);

console.log(
  `🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`
);
