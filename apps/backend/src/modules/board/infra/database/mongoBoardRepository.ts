import mongoose from "mongoose";

import type {
  Board,
  BoardId,
  BoardRepository,
} from "@/modules/board/domain/Board";
import boardModel from "./boardModel";

export const makeMongoBoardRepository = (): BoardRepository => ({
  async getNextId() {
    return { value: crypto.randomUUID() };
  },
  async store(entity: Board) {
    await boardModel.create({
      name: entity.name,
      visibility: entity.visibility,
    });
  },
  async index() {
    return boardModel.find();
  },
  async delete(id: BoardId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid board id");

    const board = await boardModel.findOne({ _id: id.value });

    if (!board) throw new Error("Board not found");

    await boardModel.deleteOne({ _id: id.value });
  },
});
