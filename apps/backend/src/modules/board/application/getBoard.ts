import type { BoardId, BoardRepository } from "../domain/Board";

export const makeGetBoard =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async (id: BoardId) => {
    const board = await boardRepository.get(id);

    return board;
  };
