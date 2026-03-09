import mongoose from "mongoose";

import type {
  Project,
  ProjectId,
  ProjectRepository,
  ProjectUpsertInput,
} from "@/modules/project/domain/Project";
import type { UpsertResult } from "@/shared/domain/UpsertResult";
import projectModel from "./projectModel";
import { ProjectMapper } from "./projectMapper";

export const makeMongoProjectRepository = (): ProjectRepository => ({
  async getNextId() {
    return { value: new mongoose.Types.ObjectId().toString() };
  },
  async store(entity: Project) {
    const data = ProjectMapper.toData(entity);

    await projectModel.create(data);
  },
  async update(entity: Partial<Project>) {
    await projectModel.updateOne(
      { _id: entity.id?.value },
      {
        name: entity?.name,
        userId: entity.userId?.value,
      },
    );
  },
  async addBoard(projectId: ProjectId, boards: string[]) {
    await projectModel.updateOne(
      { _id: projectId.value },
      {
        $addToSet: {
          boards: boards,
        },
      },
    );
  },
  async get(id: ProjectId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid project id");

    const project = await projectModel
      .findOne({ _id: id.value })
      .populate({ path: "boards", populate: { path: "blocks" } });

    if (!project) throw new Error("Project not found");

    return ProjectMapper.toEntity(project);
  },
  async index() {
    return await projectModel.find();
  },
  async delete(id: ProjectId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid project id");

    const project = await projectModel.findOne({ _id: id.value });

    if (!project) throw new Error("Project not found");

    await projectModel.deleteOne({ _id: id.value });
  },
  async batchUpsert(entities: ProjectUpsertInput[]): Promise<UpsertResult[]> {
    if (entities.length === 0) return [];

    const clientRefs = entities.map((e) => e.clientRef);
    const existingDocs = await projectModel.find({
      clientRef: { $in: clientRefs },
    });
    const existingMap = new Map(
      existingDocs.map((doc) => [doc.clientRef, doc]),
    );

    const toCreate: ProjectUpsertInput[] = [];
    const toUpdate: { input: ProjectUpsertInput; docId: string }[] = [];
    const results: UpsertResult[] = [];

    for (const input of entities) {
      const existing = existingMap.get(input.clientRef);

      if (existing) {
        const existingUpdatedAt = existing.updatedAt?.getTime() ?? 0;
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
        ? projectModel.insertMany(
            toCreate.map((input) => ({
              name: input.name,
              userId: input.userId.value,
              clientRef: input.clientRef,
              boards: [],
            })),
          )
        : [],
      toUpdate.length > 0
        ? projectModel.bulkWrite(
            toUpdate.map(({ input, docId }) => ({
              updateOne: {
                filter: { _id: docId },
                update: {
                  $set: { name: input.name, userId: input.userId.value },
                },
              },
            })),
          )
        : null,
    ]);

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
