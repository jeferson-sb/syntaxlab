import type { Block, BlockRepository } from "@/modules/block/domain/Block";
import type { AnyCreateBlockDTO } from "@/modules/block/application/createBlock";

type StoredBlock = Block & {
  props?: AnyCreateBlockDTO["props"];
};

export class InMemoryBlockRepository implements BlockRepository {
  private blocks = new Map<string, StoredBlock>();
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

    this.blocks.delete(id);
  }
}
