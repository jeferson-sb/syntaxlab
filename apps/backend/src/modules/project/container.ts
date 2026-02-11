import Elysia from "elysia";
import { makeMongoProjectRepository } from "@/modules/project/infra/database/mongoProjectRepository";
import { makeMongoBoardRepository } from "@/modules/board/infra/database/mongoBoardRepository";
import { makeCreateProject } from "@/modules/project/application/createProject";
import { makeGetProjects } from "@/modules/project/application/getProjects";
import { makeDeleteProject } from "@/modules/project/application/deleteProject";
import { makeUpdateProject } from "@/modules/project/application/updateProject";
import { makeAddBoardToProject } from "@/modules/project/application/addBoardToProject";

export const registerProjectContainer = () =>
  new Elysia({ name: "module/project" })
    .decorate("projectRepository", makeMongoProjectRepository())
    .decorate("boardRepository", makeMongoBoardRepository())
    .resolve({ as: "scoped" }, ({ projectRepository, boardRepository }) => ({
      createProjectUseCase: makeCreateProject({ projectRepository }),
      getProjectsUseCase: makeGetProjects({ projectRepository }),
      deleteProjectUseCase: makeDeleteProject({ projectRepository }),
      updateProjectUseCase: makeUpdateProject({ projectRepository }),
      addBoardToProjectUseCase: makeAddBoardToProject({
        projectRepository,
        boardRepository,
      }),
    }));
