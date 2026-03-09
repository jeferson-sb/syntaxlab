import Elysia from "elysia";
import { makeMongoBoardRepository } from "@/modules/board/infra/database/mongoBoardRepository";
import { makeCreateBoard } from "@/modules/board/application/createBoard";
import { makeGetBoards } from "@/modules/board/application/getBoards";
import { makeGetBoard } from "@/modules/board/application/getBoard";
import { makeDeleteBoard } from "@/modules/board/application/deleteBoard";
import { makeUpdateBoard } from "@/modules/board/application/updateBoard";
import { makeBatchUpsertBoards } from "@/modules/board/application/batchUpsertBoards";
import type { BoardRepository } from "@/modules/board/domain/Board";

type BoardContainerDependencies = {
  boardRepository?: BoardRepository;
};

export const registerBoardContainer = (
  dependencies: BoardContainerDependencies = {},
) =>
  new Elysia({ name: "module/board" })
    .decorate(
      "boardRepository",
      dependencies.boardRepository ?? makeMongoBoardRepository(),
    )
    .resolve({ as: "scoped" }, ({ boardRepository }) => ({
      createBoardUseCase: makeCreateBoard({ boardRepository }),
      getBoardsUseCase: makeGetBoards({ boardRepository }),
      getBoardUseCase: makeGetBoard({ boardRepository }),
      deleteBoardUseCase: makeDeleteBoard({ boardRepository }),
      updateBoardUseCase: makeUpdateBoard({ boardRepository }),
      batchUpsertBoardsUseCase: makeBatchUpsertBoards({ boardRepository }),
    }));
