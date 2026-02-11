import { Block } from "@/modules/block/domain/Block";
import { BoardId, BoardRepository } from "../domain/Board";

type UpdateBoardDTO = {
  id: BoardId;
  name: string;
  visibility: "public" | "private";
  blocks: Block["id"][];
};

export const makeUpdateBoard =
  ({ boardRepository }: { boardRepository: BoardRepository }) =>
  async (payload: Partial<UpdateBoardDTO>) => {
    await boardRepository.update(payload);
  };
