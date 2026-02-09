import { Elysia, t } from "elysia";
import { registerBoardContainer } from "@/modules/board/container";

export const boardController = new Elysia({ prefix: "/boards" })
  .use(registerBoardContainer())
  .post("/", ({ body, createBoardUseCase }) => createBoardUseCase(body), {
    body: t.Object({
      name: t.String(),
      visibility: t.Union([t.Literal("private"), t.Literal("public")]),
      blocks: t.Array(t.Any()),
    }),
  })
  .get("/", ({ getBoardsUseCase }) => getBoardsUseCase())
  .delete("/:id", async ({ params, status, deleteBoardUseCase }) => {
    try {
      await deleteBoardUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
