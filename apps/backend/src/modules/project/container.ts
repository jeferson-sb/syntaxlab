import Elysia from "elysia";
import { makeMongoProjectRepository } from "@/modules/project/infra/database/mongoProjectRepository";
import { makeCreateProject } from '@/modules/project/application/createProject'
import { makeGetProjects } from "@/modules/project/application/getProjects";
import { makeDeleteProject } from "@/modules/project/application/deleteProject";

export const registerProjectContainer = () =>
  new Elysia({ name: "module/project" })
    .decorate("projectRepository", makeMongoProjectRepository())
    .resolve({ as: "scoped" }, ({ projectRepository }) => ({
      createProjectUseCase: makeCreateProject({ projectRepository }),
      getProjectsUseCase: makeGetProjects({ projectRepository }),
      deleteProjectUseCase: makeDeleteProject({ projectRepository }),
    }));
