import { Elysia, t } from "elysia";
import { registerBlockContainer } from "@/modules/block/container";
import { AnyCreateBlockDTO } from "@/modules/block/application/createBlock";

export const blockController = new Elysia({ prefix: "/blocks" })
  .use(registerBlockContainer())
  .post("/", ({ body, createBlockUseCase }) => createBlockUseCase(body as AnyCreateBlockDTO), {
    body: t.Object({
      type: t.Union([
        t.Literal("code"),
        t.Literal("note"),
        t.Literal("bookmark"),
        t.Literal("image"),
      ]),
      x: t.Number(),
      y: t.Number(),
      props: t.Record(t.String(), t.Any()),
    }),
  })
  .get("/", ({ getBlocksUseCase }) => getBlocksUseCase())
  .delete("/:id", async ({ params, status, deleteBlockUseCase }) => {
    try {
      await deleteBlockUseCase(params.id);
      return status(204);
    } catch (error) {
      if (error instanceof Error) return status(404, error.message);
    }
  });
