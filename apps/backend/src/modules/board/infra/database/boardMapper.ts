import type { DataMapper } from "@/shared/domain/DataMapper";
import type { Board } from "@/modules/board/domain/Board";
import type { BoardDocument } from "./boardModel";

export const BoardMapper: DataMapper<Board, BoardDocument>  = {
  toData: (entity) => ({
    name: entity.name,
    visibility: entity.visibility,
    blocks: entity.blocks,
  }),
  toEntity: (data) => ({
    id: { value: data._id.toString() },
    name: data.name ?? '',
    visibility: data.visibility ?? 'public',
    blocks: data.blocks ?? [],
  }),
};
