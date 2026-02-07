import { ProjectId, ProjectRepository } from "../domain/Project";

export const makeDeleteProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (id: ProjectId) => {
    await projectRepository.delete(id);
  };
