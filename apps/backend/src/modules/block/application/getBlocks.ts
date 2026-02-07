import { BlockRepository } from "../domain/Block";

export const makeGetBlocks =
  ({ blockRepository }: { blockRepository: BlockRepository }) =>
  async () => {
    const blocks = await blockRepository.index();

    return blocks;
  };
