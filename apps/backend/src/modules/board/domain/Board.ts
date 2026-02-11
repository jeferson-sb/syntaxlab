import { Block } from "@/modules/block/domain/Block";
import { AggregateId, AggregateRoot } from "@/shared/domain/AggregateRoot";
import { Repository } from "@/shared/domain/Repository";

export type BoardId = AggregateId<string>;

type UpdateBoardData = Partial<Omit<Board, 'blocks'>> & {
  blockIds?: Block["id"][];
};

export type BoardRepository = Repository<Board> & {
  get(id: BoardId): Promise<Board>;
  update(entity: UpdateBoardData): Promise<void>;
};

export type Board = AggregateRoot<BoardId> & {
  name: string;
  blocks: Block[];
  visibility: "private" | "public";
};

export const createBoard = (props: Board): Board => ({
  id: props.id,
  name: props.name,
  visibility: props.visibility,
  blocks: props.blocks,
});
