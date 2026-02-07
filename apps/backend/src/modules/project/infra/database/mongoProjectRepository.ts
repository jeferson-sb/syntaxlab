import mongoose from "mongoose";

import type {
  Project,
  ProjectId,
  ProjectRepository,
} from "@/modules/project/domain/Project";
import projectModel from "./projectModel";

export const makeMongoProjectRepository = (): ProjectRepository => ({
  async getNextId() {
    return { value: crypto.randomUUID() };
  },
  async store(entity: Project) {
    await projectModel.create({
      name: entity.name,
      userId: entity.userId.value,
    });
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
});
