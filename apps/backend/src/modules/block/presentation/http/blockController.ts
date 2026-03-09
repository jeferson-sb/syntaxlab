import { Elysia, t } from "elysia";
import { registerBlockContainer } from "@/modules/block/container";
import { AnyCreateBlockDTO } from "@/modules/block/application/createBlock";
import type { BlockRepository } from "@/modules/block/domain/Block";

export const makeBlockController = (blockRepository?: BlockRepository) =>
  new Elysia({ prefix: "/blocks" })
    .use(registerBlockContainer({ blockRepository }))
    .post(
      "/",
      ({ body, createBlockUseCase }) =>
        createBlockUseCase(body as AnyCreateBlockDTO),
      {
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
      },
    )
    .post(
      "/batch",
      async ({ body, status, batchUpsertBlocksUseCase }) => {
        const results = await batchUpsertBlocksUseCase(body);
        return status(200, { results });
      },
      {
        body: t.Array(
          t.Object({
            clientRef: t.String(),
            type: t.Union([
              t.Literal("code"),
              t.Literal("note"),
              t.Literal("bookmark"),
              t.Literal("image"),
              t.Literal("sticky"),
            ]),
            x: t.Number(),
            y: t.Number(),
            boardId: t.Optional(t.String()),
            props: t.Record(t.String(), t.Any()),
            updatedAt: t.String(),
          }),
        ),
      },
    )
    .get("/", ({ getBlocksUseCase }) => getBlocksUseCase())
    .delete("/:id", async ({ params, status, deleteBlockUseCase }) => {
      try {
        await deleteBlockUseCase(params.id);
        return status(204);
      } catch (error) {
        if (error instanceof Error) return status(404, error.message);
      }
    });

export const blockController = makeBlockController();
