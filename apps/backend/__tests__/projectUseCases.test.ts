import { beforeEach, describe, expect, it } from "vitest";
import { makeCreateProject } from "@/modules/project/application/createProject";
import { makeGetProjects } from "@/modules/project/application/getProjects";
import { makeGetProject } from "@/modules/project/application/getProject";
import { makeUpdateProject } from "@/modules/project/application/updateProject";
import { makeDeleteProject } from "@/modules/project/application/deleteProject";
import { makeAddBoardToProject } from "@/modules/project/application/addBoardToProject";
import { InMemoryProjectRepository } from "@/modules/project/infra/database/inMemoryProjectRepository";
import type { ProjectId } from "@/modules/project/domain/Project";

describe("project use cases", () => {
  let projectRepository: InMemoryProjectRepository;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
  });

  it("creates a project and returns its id", async () => {
    const createProject = makeCreateProject({ projectRepository });

    const createdId = await createProject({
      name: "My Project",
      userId: "user-1",
      boards: [],
    });

    expect(createdId).toEqual({ value: "project-1" });
  });

  it("returns all projects", async () => {
    const createProject = makeCreateProject({ projectRepository });
    const getProjects = makeGetProjects({ projectRepository });

    await createProject({ name: "Project A", userId: "user-1", boards: [] });
    await createProject({ name: "Project B", userId: "user-2", boards: [] });

    const result = await getProjects();

    expect(result).toHaveLength(2);
    expect(result.map((project) => project.name)).toEqual([
      "Project A",
      "Project B",
    ]);
  });

  it("returns a project by id", async () => {
    const createProject = makeCreateProject({ projectRepository });
    const getProject = makeGetProject({ projectRepository });

    const id = await createProject({
      name: "My Project",
      userId: "user-1",
      boards: [],
    });
    const result = await getProject(id);

    expect(result).toEqual(
      expect.objectContaining({
        id,
        name: "My Project",
        userId: { value: "user-1" },
      }),
    );
  });

  it("updates a project with partial payload", async () => {
    const createProject = makeCreateProject({ projectRepository });
    const getProject = makeGetProject({ projectRepository });
    const updateProject = makeUpdateProject({ projectRepository });

    const id = await createProject({
      name: "My Project",
      userId: "user-1",
      boards: [],
    });

    await updateProject({
      id,
      name: "Renamed Project",
    });

    const updatedProject = await getProject(id);

    expect(updatedProject.name).toBe("Renamed Project");
  });

  it("throws when updating a non-existing project", async () => {
    const updateProject = makeUpdateProject({ projectRepository });

    await expect(
      updateProject({ id: { value: "project-404" }, name: "Missing" }),
    ).rejects.toThrow("Project not found");
  });

  it("deletes a project by id", async () => {
    const createProject = makeCreateProject({ projectRepository });
    const getProject = makeGetProject({ projectRepository });
    const deleteProject = makeDeleteProject({ projectRepository });

    const id = await createProject({
      name: "My Project",
      userId: "user-1",
      boards: [],
    });

    await deleteProject(id);

    await expect(getProject(id)).rejects.toThrow("Project not found");
  });

  it("adds boards to a project", async () => {
    const createProject = makeCreateProject({ projectRepository });
    const getProject = makeGetProject({ projectRepository });
    const addBoardToProject = makeAddBoardToProject({ projectRepository });

    const id: ProjectId = await createProject({
      name: "My Project",
      userId: "user-1",
      boards: [],
    });

    const boardIds = ["board-1", "board-2"];

    await addBoardToProject(id, boardIds);
    const project = await getProject(id);

    expect(project.boards).toEqual(boardIds);
  });
});
