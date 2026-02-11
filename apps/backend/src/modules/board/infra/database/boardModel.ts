import mongoose from "mongoose";

export const boardSchema = new mongoose.Schema(
  {
    name: String,
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Block" }],
    visibility: {
      type: String,
      enum: ["private", "public"],
    },
  },
  { timestamps: true }
);

export const boardModel = mongoose.model("Board", boardSchema);
export default boardModel;
