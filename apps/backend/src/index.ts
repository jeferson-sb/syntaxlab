import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";

import { projectController } from "@/modules/project/presentation/http/projectController";
import { boardController } from "@/modules/board/presentation/http/boardController";
import { blockController } from "@/modules/block/presentation/http/blockController";
import { makeMongoDBConnection } from "@/bootstrap/db";

// type DataMapper<AR extends AggregateRoot<any>, DATA> = {
//   toEntity(data: DATA): AR;
//   toData(entity: AR): DATA;
// };

// type Result = {};
// type Either = {};

makeMongoDBConnection();

const app = new Elysia({ prefix: "/api" })
  .use(openapi({ references: fromTypes() }))
  .use(cors())
  .use(logger())
  .use(projectController)
  .use(boardController)
  .use(blockController);

app.listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
