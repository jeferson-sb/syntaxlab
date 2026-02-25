import Elysia from "elysia";
import { makeMongoBlockRepository } from "@/modules/block/infra/database/mongoBlockRepository";
import { makeCreateBlock } from "@/modules/block/application/createBlock";
import { makeGetBlocks } from "@/modules/block/application/getBlocks";
import { makeDeleteBlock } from "@/modules/block/application/deleteBlock";
import type { BlockRepository } from "@/modules/block/domain/Block";

type BlockContainerDependencies = {
  blockRepository?: BlockRepository;
};

export const registerBlockContainer = (
  dependencies: BlockContainerDependencies = {},
) =>
  new Elysia({ name: "module/block" })
    .decorate(
      "blockRepository",
      dependencies.blockRepository ?? makeMongoBlockRepository(),
    )
    .resolve({ as: "scoped" }, ({ blockRepository }) => ({
      createBlockUseCase: makeCreateBlock({ blockRepository }),
      getBlocksUseCase: makeGetBlocks({ blockRepository }),
      deleteBlockUseCase: makeDeleteBlock({ blockRepository }),
    }));
