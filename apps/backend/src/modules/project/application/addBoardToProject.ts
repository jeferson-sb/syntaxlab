import { ProjectId, ProjectRepository } from "../domain/Project";

export const makeAddBoardToProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (id: ProjectId, payload: string[]) => {
    await projectRepository.addBoard(id, payload);
  };
