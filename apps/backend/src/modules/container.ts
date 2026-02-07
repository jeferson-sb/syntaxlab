import { makeCreateProject } from "@/modules/project/application/createProject";
import { makeGetProjects } from "@/modules/project/application/getProjects";
import { makeDeleteProject } from "@/modules/project/application/deleteProject";
import { makeMongoProjectRepository } from "@/modules/project/infra/database/mongoProjectRepository";
import { makeCreateBoard } from "@/modules/board/application/createBoard";
import { makeGetBoards } from "@/modules/board/application/getBoards";
import { makeDeleteBoard } from "@/modules/board/application/deleteBoard";
import { makeMongoBoardRepository } from "@/modules/board/infra/database/mongoBoardRepository";
import { makeCreateBlock } from "@/modules/block/application/createBlock";
import { makeGetBlocks } from "@/modules/block/application/getBlocks";
import { makeDeleteBlock } from "@/modules/block/application/deleteBlock";
import { makeMongoBlockRepository } from "@/modules/block/infra/database/mongoBlockRepository";

const projectRepository = makeMongoProjectRepository();
const boardRepository = makeMongoBoardRepository();
const blockRepository = makeMongoBlockRepository();

export const container = {
  createProjectUseCase: makeCreateProject({
    projectRepository,
  }),
  getProjectsUseCase: makeGetProjects({
    projectRepository,
  }),
  deleteProjectUseCase: makeDeleteProject({
    projectRepository,
  }),
  createBoardUseCase: makeCreateBoard({
    boardRepository,
  }),
  getBoardsUseCase: makeGetBoards({
    boardRepository,
  }),
  deleteBoardUseCase: makeDeleteBoard({
    boardRepository,
  }),
  createBlockUseCase: makeCreateBlock({
    blockRepository,
  }),
  getBlocksUseCase: makeGetBlocks({
    blockRepository,
  }),
  deleteBlockUseCase: makeDeleteBlock({
    blockRepository,
  }),
};

export type Container = typeof container;
