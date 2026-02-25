import type { Block } from "@/modules/block/domain/Block";
import type {
  Board,
  BoardId,
  BoardRepository,
} from "@/modules/board/domain/Board";

type UpdatableBoardPayload = Partial<Board> & {
  blockIds?: Block["id"][];
  blocks?: Block["id"][];
};

export class InMemoryBoardRepository implements BoardRepository {
  private boards = new Map<string, Board>();
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

    this.boards.delete(id.value);
  }
}
