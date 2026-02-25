import Elysia from "elysia";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryBoardRepository } from "@/modules/board/infra/database/inMemoryBoardRepository";
import { makeBoardController } from "@/modules/board/presentation/http/boardController";

let boardRepository: InMemoryBoardRepository;

const makeApp = () => new Elysia().use(makeBoardController(boardRepository));

const createDummyBoard = async (app: ReturnType<typeof makeApp>) => {
  await app.handle(
    new Request("http://localhost/boards", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "My Board",
        visibility: "private",
        blocks: [],
      }),
    }),
  );
};

describe("boardController", () => {
  beforeEach(() => {
    boardRepository = new InMemoryBoardRepository();
  });

  it("POST /boards creates a board", async () => {
    const app = makeApp();
    const payload = { name: "My Board", visibility: "private", blocks: [] };

    const response = await app.handle(
      new Request("http://localhost/boards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(200);
  });

  it("POST /boards returns 400 when payload is invalid", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/boards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "My Board" }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.errors?.length).toBeGreaterThan(0);
  });

  it("GET /boards returns all boards", async () => {
    const app = makeApp();
    await createDummyBoard(app);

    const response = await app.handle(
      new Request("http://localhost/boards", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      expect.objectContaining({
        id: { value: "board-1" },
        name: "My Board",
      }),
    ]);
  });

  it("GET /boards/:id returns one board", async () => {
    const app = makeApp();
    await createDummyBoard(app);

    const response = await app.handle(
      new Request("http://localhost/boards/board-1", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({
        id: { value: "board-1" },
        name: "My Board",
      }),
    );
  });

  it("GET /boards/:id returns 404 when board does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/boards/board-404", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Board not found");
  });

  it("PATCH /boards/:id updates a board", async () => {
    const app = makeApp();
    await createDummyBoard(app);

    const response = await app.handle(
      new Request("http://localhost/boards/board-1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      }),
    );

    expect(response.status).toBe(204);
  });

  it("PATCH /boards/:id returns 404 when board does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/boards/board-404", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Board not found");
  });

  it("DELETE /boards/:id deletes a board", async () => {
    const app = makeApp();
    await createDummyBoard(app);

    const response = await app.handle(
      new Request("http://localhost/boards/board-1", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(204);
  });

  it("DELETE /boards/:id returns 404 when board does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/boards/board-404", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Board not found");
  });
});
