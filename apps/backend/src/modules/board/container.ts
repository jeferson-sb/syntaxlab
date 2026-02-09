import Elysia from "elysia";
import { makeMongoBoardRepository } from "@/modules/board/infra/database/mongoBoardRepository";
import { makeCreateBoard } from '@/modules/board/application/createBoard'
import { makeGetBoards } from "@/modules/board/application/getBoards";
import { makeDeleteBoard } from "@/modules/board/application/deleteBoard";

export const registerBoardContainer = () =>
  new Elysia({ name: "module/board" })
    .decorate("boardRepository", makeMongoBoardRepository())
    .resolve({ as: "scoped" }, ({ boardRepository }) => ({
      createBoardUseCase: makeCreateBoard({ boardRepository }),
      getBoardsUseCase: makeGetBoards({ boardRepository }),
      deleteBoardUseCase: makeDeleteBoard({ boardRepository }),
    }));
