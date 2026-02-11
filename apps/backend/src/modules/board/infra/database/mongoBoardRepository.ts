import mongoose from "mongoose";

import type {
  Board,
  BoardId,
  BoardRepository,
} from "@/modules/board/domain/Board";
import boardModel from "./boardModel";
import { BoardMapper } from "./boardMapper";

export const makeMongoBoardRepository = (): BoardRepository => ({
  async getNextId() {
    return { value: new mongoose.Types.ObjectId().toString() };
  },
  async store(entity: Board) {
    const data = BoardMapper.toData(entity);

    await boardModel.create(data);
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

    return BoardMapper.toEntity(board);
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
