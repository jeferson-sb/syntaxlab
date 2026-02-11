import { BoardId } from "@/modules/board/domain/Board";
import { ProjectId, ProjectRepository } from "../domain/Project";

export const makeAddBoardToProject =
  ({ projectRepository }: { projectRepository: ProjectRepository }) =>
  async (id: ProjectId, payload: BoardId[]) => {
    await projectRepository.addBoard(id, payload);
  };
