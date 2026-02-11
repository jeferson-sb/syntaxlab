import { Board, BoardRepository } from "@/modules/board/domain/Board";
import { ProjectId, ProjectRepository } from "../domain/Project";

type AddBoardDTO = Omit<Board, "blocks" | "id">;

export const makeAddBoardToProject =
  ({
    projectRepository,
    boardRepository,
  }: {
    projectRepository: ProjectRepository;
    boardRepository: BoardRepository;
  }) =>
  async (id: ProjectId, payload: AddBoardDTO) => {
    const boardId = await boardRepository.getNextId();

    await projectRepository.addBoard(id, {
      ...payload,
      id: boardId,
      blocks: [],
    });
  };
