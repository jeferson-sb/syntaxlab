import { BlockRepository } from "../domain/Block";

export const makeDeleteBlock =
  ({ blockRepository }: { blockRepository: BlockRepository }) =>
  async (id: string) => {
    await blockRepository.delete(id);
  };
