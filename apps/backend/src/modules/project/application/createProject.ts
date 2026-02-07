import { Board } from "@/modules/board/domain/Board";
import { createProject, ProjectRepository } from "../domain/Project";

type CreateProjectDTO = {
  name: string;
  userId: string;
  boards: Board[];
};

export const makeCreateProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (payload: CreateProjectDTO) => {
    const id = await projectRepository.getNextId();

    const project = createProject({
      id,
      name: payload.name,
      userId: { value: payload.userId },
      boards: [],
    });

    await projectRepository.store(project);

    return project.id;
  };
