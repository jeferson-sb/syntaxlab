import type {
  ProjectId,
  ProjectRepository,
} from "@/modules/project/domain/Project";

export const makeGetProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (id: ProjectId) => {
    const project = await projectRepository.get(id);

    return project;
  };
