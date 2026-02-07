import { BoardId, BoardRepository } from "../domain/Board";

export const makeDeleteBoard =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async (id: BoardId) => {
    await boardRepository.delete(id);
  };
