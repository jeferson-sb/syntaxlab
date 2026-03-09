import mongoose from "mongoose";

import type {
  Block,
  BlockRepository,
  BlockUpsertInput,
} from "@/modules/block/domain/Block";
import type { BlockPropsByType } from "@/modules/block/application/createBlock";
import type { UpsertResult } from "@/shared/domain/UpsertResult";
import blockModel from "./blockModel";
import boardModel from "@/modules/board/infra/database/boardModel";

type AnyBlock = {
  [K in keyof BlockPropsByType]: Block & { props: BlockPropsByType[K] };
}[keyof BlockPropsByType];

export const makeMongoBlockRepository = (): BlockRepository => ({
  async getNextId() {
    return new mongoose.Types.ObjectId().toString();
  },
  async store(entity: AnyBlock) {
    await blockModel.create({
      type: entity.type,
      x: entity.x,
      y: entity.y,
      props: entity.props,
    });
  },
  async index() {
    return blockModel.find();
  },
  async delete(id: string) {
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid block id");

    const block = await blockModel.findOne({ _id: id });

    if (!block) throw new Error("Block not found");

    await blockModel.deleteOne({ _id: id });
  },
  async batchUpsert(entities: BlockUpsertInput[]): Promise<UpsertResult[]> {
    if (entities.length === 0) return [];

    // Look up board _ids by their clientRefs
    const boardClientRefs = [
      ...new Set(entities.map((e) => e.boardId).filter(Boolean)),
    ];
    const boardDocs = await boardModel.find({
      clientRef: { $in: boardClientRefs },
    });
    const boardIdMap = new Map(boardDocs.map((b) => [b.clientRef, b._id]));

    const clientRefs = entities.map((e) => e.clientRef);
    const existingDocs = await blockModel.find({
      clientRef: { $in: clientRefs },
    });
    const existingMap = new Map(
      existingDocs.map((doc) => [doc.clientRef, doc]),
    );

    const toCreate: BlockUpsertInput[] = [];
    const toUpdate: { input: BlockUpsertInput; docId: string }[] = [];
    const results: UpsertResult[] = [];

    for (const input of entities) {
      const existing = existingMap.get(input.clientRef);

      if (existing) {
        const existingUpdatedAt =
          (
            existing as typeof existing & { updatedAt?: Date }
          ).updatedAt?.getTime() ?? 0;
        const inputUpdatedAt = new Date(input.updatedAt).getTime();

        if (inputUpdatedAt <= existingUpdatedAt) {
          results.push({
            clientRef: input.clientRef,
            serverId: existing._id.toString(),
            action: "skipped",
          });
        } else {
          toUpdate.push({ input, docId: existing._id.toString() });
        }
      } else {
        toCreate.push(input);
      }
    }

    const [createdDocs] = await Promise.all([
      toCreate.length > 0
        ? blockModel.insertMany(
            toCreate.map((input) => ({
              type: input.type,
              x: input.x,
              y: input.y,
              props: input.props,
              clientRef: input.clientRef,
              boardId: input.boardId
                ? boardIdMap.get(input.boardId)
                : undefined,
            })),
          )
        : [],
      toUpdate.length > 0
        ? blockModel.bulkWrite(
            toUpdate.map(({ input, docId }) => ({
              updateOne: {
                filter: { _id: docId },
                update: {
                  $set: {
                    type: input.type,
                    x: input.x,
                    y: input.y,
                    props: input.props,
                  },
                },
              },
            })),
          )
        : null,
    ]);

    // Auto-link created blocks to boards in bulk
    const boardLinks = createdDocs
      .filter((doc) => doc.boardId)
      .reduce(
        (acc, doc) => {
          const boardId = doc.boardId!.toString();
          if (!acc[boardId]) acc[boardId] = [];
          acc[boardId].push(doc._id);
          return acc;
        },
        {} as Record<string, mongoose.Types.ObjectId[]>,
      );

    if (Object.keys(boardLinks).length > 0) {
      await boardModel.bulkWrite(
        Object.entries(boardLinks).map(([boardId, blockIds]) => ({
          updateOne: {
            filter: { _id: boardId },
            update: { $addToSet: { blocks: { $each: blockIds } } },
          },
        })),
      );
    }

    const createdResults: UpsertResult[] = createdDocs.map((doc) => ({
      clientRef: doc.clientRef!,
      serverId: doc._id.toString(),
      action: "created",
    }));

    const updatedResults: UpsertResult[] = toUpdate.map(({ input, docId }) => ({
      clientRef: input.clientRef,
      serverId: docId,
      action: "updated",
    }));

    return [...results, ...createdResults, ...updatedResults];
  },
});
