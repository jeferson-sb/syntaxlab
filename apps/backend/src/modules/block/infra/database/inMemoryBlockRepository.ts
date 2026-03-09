import type {
  Block,
  BlockRepository,
  BlockUpsertInput,
} from "@/modules/block/domain/Block";
import type { AnyCreateBlockDTO } from "@/modules/block/application/createBlock";
import type { UpsertResult } from "@/shared/domain/UpsertResult";

type StoredBlock = Block & {
  props?: AnyCreateBlockDTO["props"];
  clientRef?: string;
  boardId?: string;
  updatedAt?: Date;
};

export class InMemoryBlockRepository implements BlockRepository {
  private blocks = new Map<string, StoredBlock>();
  private clientRefIndex = new Map<string, string>();
  private nextId = 1;

  async getNextId(): Promise<string> {
    return `block-${this.nextId++}`;
  }

  async store(entity: StoredBlock): Promise<void> {
    this.blocks.set(entity.id, { ...entity });
  }

  async index(): Promise<StoredBlock[]> {
    return [...this.blocks.values()].map((block) => ({ ...block }));
  }

  async delete(id: string): Promise<void> {
    if (!this.blocks.has(id)) throw new Error("Block not found");

    const block = this.blocks.get(id);
    if (block?.clientRef) {
      this.clientRefIndex.delete(block.clientRef);
    }
    this.blocks.delete(id);
  }

  async batchUpsert(entities: BlockUpsertInput[]): Promise<UpsertResult[]> {
    const results: UpsertResult[] = [];

    for (const input of entities) {
      const existingId = this.clientRefIndex.get(input.clientRef);
      const existing = existingId ? this.blocks.get(existingId) : undefined;

      if (existing) {
        const existingUpdatedAt = existing.updatedAt?.getTime() ?? 0;
        const inputUpdatedAt = new Date(input.updatedAt).getTime();

        if (inputUpdatedAt <= existingUpdatedAt) {
          results.push({
            clientRef: input.clientRef,
            serverId: existing.id,
            action: "skipped",
          });
          continue;
        }

        this.blocks.set(existing.id, {
          ...existing,
          type: input.type,
          x: input.x,
          y: input.y,
          props: input.props,
          boardId: input.boardId,
          updatedAt: new Date(input.updatedAt),
        });

        results.push({
          clientRef: input.clientRef,
          serverId: existing.id,
          action: "updated",
        });
      } else {
        const id = await this.getNextId();
        const newBlock: StoredBlock = {
          id,
          type: input.type,
          x: input.x,
          y: input.y,
          props: input.props,
          clientRef: input.clientRef,
          boardId: input.boardId,
          updatedAt: new Date(input.updatedAt),
        };

        this.blocks.set(id, newBlock);
        this.clientRefIndex.set(input.clientRef, id);

        results.push({
          clientRef: input.clientRef,
          serverId: id,
          action: "created",
        });
      }
    }

    return results;
  }
}
