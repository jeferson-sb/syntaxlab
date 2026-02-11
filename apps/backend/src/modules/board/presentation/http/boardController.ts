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
  .patch(
    "/:id",
    async ({ params, body, status, updateBoardUseCase }) => {
      try {
        await updateBoardUseCase({ id: { value: params.id }, ...body });
        return status(204);
      } catch (error) {
        if (error instanceof Error) return status(404, error.message);
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        visibility: t.Optional(
          t.Union([t.Literal("private"), t.Literal("public")])
        ),
        blocks: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .get("/", ({ getBoardsUseCase }) => getBoardsUseCase())
  .get("/:id", async ({ params, status, getBoardUseCase }) => {
    try {
      return await getBoardUseCase({ value: params.id });
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  })
  .delete("/:id", async ({ params, status, deleteBoardUseCase }) => {
    try {
      await deleteBoardUseCase({ value: params.id });
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
