import mongoose from "mongoose";

import type {
  Board,
  BoardId,
  BoardRepository,
  BoardUpsertInput,
} from "@/modules/board/domain/Board";
import type { UpsertResult } from "@/shared/domain/UpsertResult";
import boardModel from "./boardModel";
import { BoardMapper } from "./boardMapper";
import projectModel from "@/modules/project/infra/database/projectModel";

export const makeMongoBoardRepository = (): BoardRepository => ({
  async getNextId() {
    return { value: new mongoose.Types.ObjectId().toString() };
  },
  async store(entity: Board) {
    const data = BoardMapper.toData(entity);

    await boardModel.create(data);
  },
  async update(entity: Partial<Board>) {
    await boardModel.updateOne(
      { _id: entity.id?.value },
      {
        name: entity?.name,
        visibility: entity.visibility,
        $addToSet: {
          blocks: entity.blocks,
        },
      },
    );
  },
  async get(id: BoardId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid board id");

    const board = await boardModel
      .findOne({ _id: id.value })
      .populate("blocks");

    if (!board) throw new Error("Board not found");

    return BoardMapper.toEntity(board);
  },
  async index() {
    return boardModel.find();
  },
  async delete(id: BoardId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid board id");

    const board = await boardModel.findOne({ _id: id.value });

    if (!board) throw new Error("Board not found");

    await boardModel.deleteOne({ _id: id.value });
  },
  async batchUpsert(entities: BoardUpsertInput[]): Promise<UpsertResult[]> {
    if (entities.length === 0) return [];

    // Look up project _ids by their clientRefs
    const projectClientRefs = [
      ...new Set(entities.map((e) => e.projectId).filter(Boolean)),
    ];
    const projectDocs = await projectModel.find({
      clientRef: { $in: projectClientRefs },
    });
    const projectIdMap = new Map(projectDocs.map((p) => [p.clientRef, p._id]));

    const clientRefs = entities.map((e) => e.clientRef);
    const existingDocs = await boardModel.find({
      clientRef: { $in: clientRefs },
    });
    const existingMap = new Map(
      existingDocs.map((doc) => [doc.clientRef, doc]),
    );

    const toCreate: BoardUpsertInput[] = [];
    const toUpdate: { input: BoardUpsertInput; docId: string }[] = [];
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
        ? boardModel.insertMany(
            toCreate.map((input) => ({
              name: input.name,
              visibility: input.visibility,
              clientRef: input.clientRef,
              projectId: input.projectId
                ? projectIdMap.get(input.projectId)
                : undefined,
              blocks: [],
            })),
          )
        : [],
      toUpdate.length > 0
        ? boardModel.bulkWrite(
            toUpdate.map(({ input, docId }) => ({
              updateOne: {
                filter: { _id: docId },
                update: {
                  $set: { name: input.name, visibility: input.visibility },
                },
              },
            })),
          )
        : null,
    ]);

    // Auto-link created boards to projects in bulk
    const projectLinks = createdDocs
      .filter((doc) => doc.projectId)
      .reduce(
        (acc, doc) => {
          const projId = doc.projectId!.toString();
          if (!acc[projId]) acc[projId] = [];
          acc[projId].push(doc._id);
          return acc;
        },
        {} as Record<string, mongoose.Types.ObjectId[]>,
      );

    if (Object.keys(projectLinks).length > 0) {
      await projectModel.bulkWrite(
        Object.entries(projectLinks).map(([projectId, boardIds]) => ({
          updateOne: {
            filter: { _id: projectId },
            update: { $addToSet: { boards: { $each: boardIds } } },
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
