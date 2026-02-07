import { BoardRepository } from "../domain/Board";

export const makeGetBoards =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async () => {
    const boards = await boardRepository.index();

    return boards;
  };
