import mongoose from "mongoose";

import type { Block, BlockRepository } from "@/modules/block/domain/Block";
import type { BlockPropsByType } from "@/modules/block/application/createBlock";
import blockModel from "./blockModel";

type AnyBlock = {
  [K in keyof BlockPropsByType]: Block & { props: BlockPropsByType[K] };
}[keyof BlockPropsByType];

export const makeMongoBlockRepository = (): BlockRepository => ({
  async getNextId() {
    return crypto.randomUUID();
  },
  async store(entity: AnyBlock) {
    await blockModel.create({
      type: entity.type,
      x: entity.x,
      y: entity.y,
      props: entity.props,
    });
  },
  async index() {
    return blockModel.find();
  },
  async delete(id: string) {
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid block id");

    const block = await blockModel.findOne({ _id: id });

    if (!block) throw new Error("Block not found");

    await blockModel.deleteOne({ _id: id });
  },
});
