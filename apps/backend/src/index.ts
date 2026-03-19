import { makeMongoDBConnection } from "@/bootstrap/db";
import { config } from "@/shared/infra/config";
import { makeServer } from "./app";

export type { App } from "./app";

const bootstrap = async () => {
  try {
    await makeMongoDBConnection();

    const server = makeServer();
    server.listen(config.serverPort);

    console.log(
      `🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`,
    );

    return server;
  } catch (error) {
    console.error("Failed to bootstrap application:", error);
    process.exit(1);
  }
};

// Start the application
bootstrap();

// TODO: Handle graceful shutdown of system and dependencies
