import type { Project } from "@/modules/project/domain/Project";
import type { DataMapper } from "@/shared/domain/DataMapper";
import type { ProjectDocument } from "./projectModel";

export const ProjectMapper: DataMapper<Project, ProjectDocument> = {
  toData: (entity) => ({
    name: entity.name,
    userId: entity.userId.value,
    boards: entity?.boards?.map(board => board.id ?  board.id.value : board) ?? [],
  }),
  toEntity: (data) => ({
    id: { value: data._id.toString() },
    name: data?.name ?? "",
    userId: { value: data?.userId ?? "" },
    boards: data?.boards ?? [],
  }),
};
