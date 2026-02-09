import { t } from "elysia";

const configSchema = t.Object({
  mongodbConnectURL: t.String(),
  serverPort: t.Optional(t.Number()),
});

export const config: typeof configSchema.static = {
  mongodbConnectURL: process.env.MONGODB_CONNECT_URL || "",
  serverPort: Number(process.env.SERVER_PORT) || 3000,
} as const;
