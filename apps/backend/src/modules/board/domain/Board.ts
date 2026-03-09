import { Block } from "@/modules/block/domain/Block";
import { AggregateId, AggregateRoot } from "@/shared/domain/AggregateRoot";
import { Repository } from "@/shared/domain/Repository";
import type {
  UpsertResult,
  BatchUpsertInput,
} from "@/shared/domain/UpsertResult";

export type BoardId = AggregateId<string>;

type UpdateBoardData = Partial<Omit<Board, "blocks">> & {
  blockIds?: Block["id"][];
};

export type BoardUpsertInput = BatchUpsertInput<
  Omit<Board, "id" | "blocks"> & { projectId?: string }
>;

export type BoardRepository = Repository<Board> & {
  get(id: BoardId): Promise<Board>;
  update(entity: UpdateBoardData): Promise<void>;
  batchUpsert(entities: BoardUpsertInput[]): Promise<UpsertResult[]>;
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
