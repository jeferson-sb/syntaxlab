import { ProjectRepository } from "../domain/Project";

export const makeGetProjects =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async () => {
    const projects = await projectRepository.index();

    return projects;
  };
