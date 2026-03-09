import type {
  BlockRepository,
  BlockUpsertInput,
} from "@/modules/block/domain/Block";

type BatchUpsertBlocksDTO = {
  clientRef: string;
  type: "code" | "note" | "bookmark" | "image" | "sticky";
  x: number;
  y: number;
  boardId?: string;
  props: Record<string, unknown>;
  updatedAt: string;
}[];

type BatchUpsertBlocksDependencies = {
  blockRepository: BlockRepository;
};

export const makeBatchUpsertBlocks =
  ({ blockRepository }: BatchUpsertBlocksDependencies) =>
  async (payload: BatchUpsertBlocksDTO) => {
    const entities: BlockUpsertInput[] = payload.map((item) => ({
      clientRef: item.clientRef,
      type: item.type,
      x: item.x,
      y: item.y,
      boardId: item.boardId,
      props: item.props,
      updatedAt: new Date(item.updatedAt),
    }));

    return blockRepository.batchUpsert(entities);
  };
