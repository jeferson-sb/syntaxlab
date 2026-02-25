import Elysia from "elysia";
import { makeMongoProjectRepository } from "@/modules/project/infra/database/mongoProjectRepository";
import { makeCreateProject } from "@/modules/project/application/createProject";
import { makeGetProjects } from "@/modules/project/application/getProjects";
import { makeGetProject } from "@/modules/project/application/getProject";
import { makeDeleteProject } from "@/modules/project/application/deleteProject";
import { makeUpdateProject } from "@/modules/project/application/updateProject";
import { makeAddBoardToProject } from "@/modules/project/application/addBoardToProject";
import type { ProjectRepository } from "@/modules/project/domain/Project";

type ProjectContainerDependencies = {
  projectRepository?: ProjectRepository;
};

export const registerProjectContainer = (
  dependencies: ProjectContainerDependencies = {},
) =>
  new Elysia({ name: "module/project" })
    .decorate(
      "projectRepository",
      dependencies.projectRepository ?? makeMongoProjectRepository(),
    )
    .resolve({ as: "scoped" }, ({ projectRepository }) => ({
      createProjectUseCase: makeCreateProject({ projectRepository }),
      getProjectsUseCase: makeGetProjects({ projectRepository }),
      getProjectUseCase: makeGetProject({ projectRepository }),
      deleteProjectUseCase: makeDeleteProject({ projectRepository }),
      updateProjectUseCase: makeUpdateProject({ projectRepository }),
      addBoardToProjectUseCase: makeAddBoardToProject({
        projectRepository,
      }),
    }));
