import { makeMongoDBConnection } from "@/bootstrap/db";
import { config } from "@/shared/infra/config";
import { makeServer } from "./app";

makeMongoDBConnection();

export const server = makeServer();
export type { App } from "./app";

server.listen(config.serverPort);

console.log(
  `🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`
);