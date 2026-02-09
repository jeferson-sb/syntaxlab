import Elysia from "elysia";
import { makeMongoBlockRepository } from "@/modules/block/infra/database/mongoBlockRepository";
import { makeCreateBlock } from '@/modules/block/application/createBlock'
import { makeGetBlocks } from "@/modules/block/application/getBlocks";
import { makeDeleteBlock } from "@/modules/block/application/deleteBlock";

export const registerBlockContainer = () =>
  new Elysia({ name: "module/block" })
    .decorate("blockRepository", makeMongoBlockRepository())
    .resolve({ as: "scoped" }, ({ blockRepository }) => ({
      createBlockUseCase: makeCreateBlock({ blockRepository }),
      getBlocksUseCase: makeGetBlocks({ blockRepository }),
      deleteBlockUseCase: makeDeleteBlock({ blockRepository }),
    }));
