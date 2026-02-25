import { beforeEach, describe, expect, it } from "vitest";
import { makeCreateBlock } from "@/modules/block/application/createBlock";
import { makeGetBlocks } from "@/modules/block/application/getBlocks";
import { makeDeleteBlock } from "@/modules/block/application/deleteBlock";
import { InMemoryBlockRepository } from "@/modules/block/infra/database/inMemoryBlockRepository";

describe("block use cases", () => {
  let blockRepository: InMemoryBlockRepository;

  beforeEach(() => {
    blockRepository = new InMemoryBlockRepository();
  });

  it("creates a block and returns its id", async () => {
    const createBlock = makeCreateBlock({ blockRepository });

    const createdId = await createBlock({
      type: "note",
      x: 10,
      y: 20,
      props: { content: "hello", size: "small" },
    });

    expect(createdId).toBe("block-1");
  });

  it("returns all blocks", async () => {
    const createBlock = makeCreateBlock({ blockRepository });
    const getBlocks = makeGetBlocks({ blockRepository });

    await createBlock({
      type: "code",
      x: 0,
      y: 0,
      props: { inlineCode: "const a = 1" },
    });
    await createBlock({
      type: "bookmark",
      x: 30,
      y: 40,
      props: { href: "https://example.com" },
    });

    const result = await getBlocks();

    expect(result).toHaveLength(2);
    expect(result.map((block) => block.type)).toEqual(["code", "bookmark"]);
  });

  it("deletes a block by id", async () => {
    const createBlock = makeCreateBlock({ blockRepository });
    const getBlocks = makeGetBlocks({ blockRepository });
    const deleteBlock = makeDeleteBlock({ blockRepository });

    const id = await createBlock({
      type: "note",
      x: 10,
      y: 20,
      props: { content: "hello", size: "small" },
    });

    await deleteBlock(id);

    expect(await getBlocks()).toEqual([]);
  });

  it("throws when deleting a non-existing block", async () => {
    const deleteBlock = makeDeleteBlock({ blockRepository });

    await expect(deleteBlock("block-404")).rejects.toThrow("Block not found");
  });
});
