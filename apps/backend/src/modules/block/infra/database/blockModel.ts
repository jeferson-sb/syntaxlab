import mongoose from "mongoose";

export const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["code", "note", "bookmark", "image"],
  },
  x: Number,
  y: Number,
  props: mongoose.Schema.Types.Mixed,
});

export const blockModel = mongoose.model("Block", blockSchema);
export default blockModel;
