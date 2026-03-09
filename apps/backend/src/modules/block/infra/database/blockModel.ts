import mongoose from "mongoose";

export const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["code", "note", "bookmark", "image", "sticky"],
    },
    clientRef: { type: String, unique: true, sparse: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    x: Number,
    y: Number,
    props: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const blockModel = mongoose.model("Block", blockSchema);
export default blockModel;
