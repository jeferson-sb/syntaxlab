import type {
  BoardRepository,
  BoardUpsertInput,
} from "@/modules/board/domain/Board";

type BatchUpsertBoardsDTO = {
  clientRef: string;
  name: string;
  visibility: "private" | "public";
  projectId?: string;
  updatedAt: string;
}[];

type BatchUpsertBoardsDependencies = {
  boardRepository: BoardRepository;
};

export const makeBatchUpsertBoards =
  ({ boardRepository }: BatchUpsertBoardsDependencies) =>
  async (payload: BatchUpsertBoardsDTO) => {
    const entities: BoardUpsertInput[] = payload.map((item) => ({
      clientRef: item.clientRef,
      name: item.name,
      visibility: item.visibility,
      projectId: item.projectId,
      updatedAt: new Date(item.updatedAt),
    }));

    return boardRepository.batchUpsert(entities);
  };
