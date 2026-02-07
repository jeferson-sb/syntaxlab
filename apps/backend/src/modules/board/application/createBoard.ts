import { Block } from "@/modules/block/domain/Block";
import { BoardRepository, createBoard } from "../domain/Board";

type CreateBoardDTO = {
  name: string;
  visibility: "private" | "public";
  blocks: Block[];
};

export const makeCreateBoard =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async (payload: CreateBoardDTO) => {
    const id = await boardRepository.getNextId();

    const board = createBoard({
      id,
      name: payload.name,
      visibility: payload.visibility,
      blocks: payload.blocks,
    });

    await boardRepository.store(board);

    return board.id;
  };
