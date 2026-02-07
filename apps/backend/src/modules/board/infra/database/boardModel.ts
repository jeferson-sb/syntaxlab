import { blockSchema } from "@/modules/block/infra/database/blockModel";
import mongoose from "mongoose";

export const boardSchema = new mongoose.Schema(
  {
    name: String,
    blocks: [blockSchema],
    visibility: {
      type: String,
      enum: ["private", "public"],
    },
  },
  { timestamps: true }
);

export const boardModel = mongoose.model("Board", boardSchema);
export default boardModel;
