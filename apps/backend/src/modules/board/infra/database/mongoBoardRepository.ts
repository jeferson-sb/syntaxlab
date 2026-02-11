import mongoose from "mongoose";

import type {
  Board,
  BoardId,
  BoardRepository,
} from "@/modules/board/domain/Board";
import boardModel from "./boardModel";

export const makeMongoBoardRepository = (): BoardRepository => ({
  async getNextId() {
    return { value: new mongoose.Types.ObjectId().toString() };
  },
  async store(entity: Board) {
    await boardModel.create({
      name: entity.name,
      visibility: entity.visibility,
    });
  },
  async update(entity: Partial<Board>) {
    await boardModel.updateOne(
      { _id: entity.id?.value },
      {
        name: entity?.name,
        visibility: entity.visibility,
        $addToSet: {
          blocks: entity.blocks,
        },
      }
    );
  },
  async get(id: BoardId) {
    if (!mongoose.isValidObjectId(id.value))
      throw new Error("Invalid board id");

    const board = await boardModel
      .findOne({ _id: id.value })
      .populate("blocks");

    if (!board) throw new Error("Board not found");

    // TODO: Refactor this to use a mapper instead of returning a plain object BoardMapper.toEntity(board)
    return {
      id: { value: board._id.toString() },
      name: board.name,
      visibility: board.visibility,
      blocks: board.blocks,
    };
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
