import type { Block } from "@/modules/block/domain/Block";
import type {
  Board,
  BoardId,
  BoardRepository,
  BoardUpsertInput,
} from "@/modules/board/domain/Board";
import type { UpsertResult } from "@/shared/domain/UpsertResult";

type UpdatableBoardPayload = Partial<Board> & {
  blockIds?: Block["id"][];
  blocks?: Block["id"][];
};

type StoredBoard = Board & { clientRef?: string; projectId?: string };

export class InMemoryBoardRepository implements BoardRepository {
  private boards = new Map<string, StoredBoard>();
  private clientRefIndex = new Map<string, string>();
  private nextId = 1;

  async getNextId(): Promise<BoardId> {
    return { value: `board-${this.nextId++}` };
  }

  async store(entity: Board): Promise<void> {
    this.boards.set(entity.id.value, {
      ...entity,
      blocks: [...entity.blocks],
    });
  }

  async index(): Promise<Board[]> {
    return [...this.boards.values()].map((board) => ({
      ...board,
      blocks: [...board.blocks],
    }));
  }

  async get(id: BoardId): Promise<Board> {
    const board = this.boards.get(id.value);

    if (!board) throw new Error("Board not found");

    return {
      ...board,
      blocks: [...board.blocks],
    };
  }

  async update(entity: UpdatableBoardPayload): Promise<void> {
    const boardId = entity.id?.value;

    if (!boardId) throw new Error("Board id is required");

    const currentBoard = this.boards.get(boardId);

    if (!currentBoard) throw new Error("Board not found");

    const incomingBlockIds = entity.blockIds ?? entity.blocks;
    const nextBlocks = incomingBlockIds
      ? incomingBlockIds.map((id) => ({
          id,
          type: "note" as const,
          x: 0,
          y: 0,
        }))
      : currentBoard.blocks;

    this.boards.set(boardId, {
      ...currentBoard,
      ...entity,
      blocks: nextBlocks,
    });
  }

  async delete(id: BoardId): Promise<void> {
    if (!this.boards.has(id.value)) throw new Error("Board not found");

    const board = this.boards.get(id.value);
    if (board?.clientRef) {
      this.clientRefIndex.delete(board.clientRef);
    }
    this.boards.delete(id.value);
  }

  async batchUpsert(entities: BoardUpsertInput[]): Promise<UpsertResult[]> {
    const results: UpsertResult[] = [];

    for (const input of entities) {
      const existingId = this.clientRefIndex.get(input.clientRef);
      const existing = existingId ? this.boards.get(existingId) : undefined;

      if (existing) {
        const existingUpdatedAt =
          (
            existing as StoredBoard & { updatedAt?: Date }
          ).updatedAt?.getTime() ?? 0;
        const inputUpdatedAt = new Date(input.updatedAt).getTime();

        if (inputUpdatedAt <= existingUpdatedAt) {
          results.push({
            clientRef: input.clientRef,
            serverId: existing.id.value,
            action: "skipped",
          });
          continue;
        }

        this.boards.set(existing.id.value, {
          ...existing,
          name: input.name,
          visibility: input.visibility,
          projectId: input.projectId,
          updatedAt: new Date(input.updatedAt),
        } as StoredBoard);

        results.push({
          clientRef: input.clientRef,
          serverId: existing.id.value,
          action: "updated",
        });
      } else {
        const id = await this.getNextId();
        const newBoard: StoredBoard & { updatedAt: Date } = {
          id,
          name: input.name,
          visibility: input.visibility,
          blocks: [],
          clientRef: input.clientRef,
          projectId: input.projectId,
          updatedAt: new Date(input.updatedAt),
        };

        this.boards.set(id.value, newBoard);
        this.clientRefIndex.set(input.clientRef, id.value);

        results.push({
          clientRef: input.clientRef,
          serverId: id.value,
          action: "created",
        });
      }
    }

    return results;
  }
}
