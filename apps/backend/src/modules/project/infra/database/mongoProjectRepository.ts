import mongoose from "mongoose";

import type {
  Project,
  ProjectId,
  ProjectRepository,
} from "@/modules/project/domain/Project";
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
      }
    );
  },
  async addBoard(projectId: ProjectId, boards: string[]) {
    await projectModel.updateOne(
      { _id: projectId.value },
      {
        $addToSet: {
          boards: boards,
        },
      }
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
});
