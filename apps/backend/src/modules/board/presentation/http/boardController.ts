import { Elysia, t } from "elysia";
import { container } from "@/modules/container";

const { createBoardUseCase, getBoardsUseCase, deleteBoardUseCase } = container;

export const boardController = new Elysia({ prefix: "/boards" })
  .post("/", ({ body }) => createBoardUseCase(body), {
    body: t.Object({
      name: t.String(),
      visibility: t.Union([t.Literal("private"), t.Literal("public")]),
      blocks: t.Array(t.Any()),
    }),
  })
  .get("/", () => getBoardsUseCase())
  .delete("/:id", async ({ params, status }) => {
    try {
      await deleteBoardUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
