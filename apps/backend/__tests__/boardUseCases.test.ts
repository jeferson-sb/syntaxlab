import { beforeEach, describe, expect, it } from "vitest";
import { makeCreateBoard } from "@/modules/board/application/createBoard";
import { makeGetBoards } from "@/modules/board/application/getBoards";
import { makeGetBoard } from "@/modules/board/application/getBoard";
import { makeUpdateBoard } from "@/modules/board/application/updateBoard";
import { makeDeleteBoard } from "@/modules/board/application/deleteBoard";
import { InMemoryBoardRepository } from "@/modules/board/infra/database/inMemoryBoardRepository";

describe("board use cases", () => {
  let boardRepository: InMemoryBoardRepository;

  beforeEach(() => {
    boardRepository = new InMemoryBoardRepository();
  });

  it("creates a board and returns its id", async () => {
    const createBoard = makeCreateBoard({ boardRepository });

    const createdId = await createBoard({
      name: "My Board",
      visibility: "private",
      blocks: [],
    });

    expect(createdId).toEqual({ value: "board-1" });
  });

  it("returns all boards", async () => {
    const createBoard = makeCreateBoard({ boardRepository });
    const getBoards = makeGetBoards({ boardRepository });

    await createBoard({ name: "Board A", visibility: "private", blocks: [] });
    await createBoard({ name: "Board B", visibility: "public", blocks: [] });

    const result = await getBoards();

    expect(result).toHaveLength(2);
    expect(result.map((board) => board.name)).toEqual(["Board A", "Board B"]);
  });

  it("returns a board by id", async () => {
    const createBoard = makeCreateBoard({ boardRepository });
    const getBoard = makeGetBoard({ boardRepository });

    const id = await createBoard({
      name: "My Board",
      visibility: "private",
      blocks: [],
    });
    const result = await getBoard(id);

    expect(result).toEqual(
      expect.objectContaining({
        id,
        name: "My Board",
        visibility: "private",
      }),
    );
  });

  it("updates a board with partial payload", async () => {
    const createBoard = makeCreateBoard({ boardRepository });
    const getBoard = makeGetBoard({ boardRepository });
    const updateBoard = makeUpdateBoard({ boardRepository });

    const id = await createBoard({
      name: "My Board",
      visibility: "private",
      blocks: [],
    });

    await updateBoard({
      id,
      name: "Renamed Board",
    });

    const updatedBoard = await getBoard(id);

    expect(updatedBoard.name).toBe("Renamed Board");
  });

  it("throws when updating a non-existing board", async () => {
    const updateBoard = makeUpdateBoard({ boardRepository });

    await expect(
      updateBoard({ id: { value: "board-404" }, name: "Missing" }),
    ).rejects.toThrow("Board not found");
  });

  it("deletes a board by id", async () => {
    const createBoard = makeCreateBoard({ boardRepository });
    const getBoard = makeGetBoard({ boardRepository });
    const deleteBoard = makeDeleteBoard({ boardRepository });

    const id = await createBoard({
      name: "My Board",
      visibility: "private",
      blocks: [],
    });

    await deleteBoard(id);

    await expect(getBoard(id)).rejects.toThrow("Board not found");
  });
});
