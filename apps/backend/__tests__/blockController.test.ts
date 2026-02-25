import Elysia from "elysia";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryBlockRepository } from "@/modules/block/infra/database/inMemoryBlockRepository";
import { makeBlockController } from "@/modules/block/presentation/http/blockController";

let blockRepository: InMemoryBlockRepository;

const makeApp = () => new Elysia().use(makeBlockController(blockRepository));

const createDummyBlock = async (app: ReturnType<typeof makeApp>) => {
  await app.handle(
    new Request("http://localhost/blocks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "note",
        x: 10,
        y: 20,
        props: { content: "hello", size: "small" },
      }),
    }),
  );
};

describe("blockController", () => {
  beforeEach(() => {
    blockRepository = new InMemoryBlockRepository();
  });

  it("POST /blocks creates a block", async () => {
    const app = makeApp();
    const payload = {
      type: "note",
      x: 10,
      y: 20,
      props: { content: "hello", size: "small" },
    };

    const response = await app.handle(
      new Request("http://localhost/blocks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(200);
  });

  it("POST /blocks returns 400 when payload is invalid", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/blocks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "note" }),
      }),
    );
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.errors?.length).toBeGreaterThan(0);
  });

  it("GET /blocks returns all blocks", async () => {
    const app = makeApp();
    await createDummyBlock(app);

    const response = await app.handle(
      new Request("http://localhost/blocks", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      expect.objectContaining({
        id: "block-1",
        type: "note",
      }),
    ]);
  });

  it("DELETE /blocks/:id deletes a block", async () => {
    const app = makeApp();
    await createDummyBlock(app);

    const response = await app.handle(
      new Request("http://localhost/blocks/block-1", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(204);
  });

  it("DELETE /blocks/:id returns 404 when block does not exist", async () => {
    const app = makeApp();

    const response = await app.handle(
      new Request("http://localhost/blocks/block-404", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Block not found");
  });
});
