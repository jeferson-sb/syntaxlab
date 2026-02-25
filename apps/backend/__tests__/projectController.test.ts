import Elysia from "elysia";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProjectRepository } from "@/modules/project/infra/database/inMemoryProjectRepository";
import { makeProjectController } from "@/modules/project/presentation/http/projectController";

let projectRepository: InMemoryProjectRepository;

const makeApp = () =>
  new Elysia().use(makeProjectController(projectRepository));

const createDummyProject = async (app: ReturnType<typeof makeApp>) => {
  await app.handle(
    new Request("http://localhost/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "My Project",
        userId: "user-1",
        boards: [],
      }),
    }),
  );
};

describe("projectController", () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
  });

  it("POST /projects creates a project", async () => {
    const app = makeApp();
    const payload = { name: "My Project", userId: "user-1", boards: [] };

    const response = await app.handle(
      new Request("http://localhost/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(201);
  });

  it("POST /projects returns 400 when payload is invalid", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "My Project" }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.errors?.length).toBeGreaterThan(0);
  });

  it("POST /projects/:id/boards adds boards to project", async () => {
    const app = makeApp();
    await createDummyProject(app);

    const response = await app.handle(
      new Request("http://localhost/projects/project-1/boards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ boards: ["board-1", "board-2"] }),
      }),
    );

    expect(response.status).toBe(201);
  });

  it("GET /projects returns all projects", async () => {
    const app = makeApp();
    await createDummyProject(app);

    const response = await app.handle(
      new Request("http://localhost/projects", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      expect.objectContaining({
        id: { value: "project-1" },
        name: "My Project",
      }),
    ]);
  });

  it("GET /projects/:id returns one project", async () => {
    const app = makeApp();
    await createDummyProject(app);

    const response = await app.handle(
      new Request("http://localhost/projects/project-1", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        id: { value: "project-1" },
        name: "My Project",
      }),
    );
  });

  it("GET /projects/:id returns 404 when project does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/projects/project-404", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Project not found");
  });

  it("PATCH /projects/:id updates a project", async () => {
    const app = makeApp();
    await createDummyProject(app);

    const response = await app.handle(
      new Request("http://localhost/projects/project-1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Updated Name", userId: "user-2" }),
      }),
    );

    expect(response.status).toBe(204);
  });

  it("PATCH /projects/:id returns 404 when project does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/projects/project-404", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Project not found");
  });

  it("DELETE /projects/:id deletes a project", async () => {
    const app = makeApp();
    await createDummyProject(app);

    const response = await app.handle(
      new Request("http://localhost/projects/project-1", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(204);
  });

  it("DELETE /projects/:id returns 404 when project does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/projects/project-404", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Project not found");
  });
});
