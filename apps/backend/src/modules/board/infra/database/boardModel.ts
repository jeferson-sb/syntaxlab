import mongoose from "mongoose";

export const boardSchema = new mongoose.Schema(
  {
    name: String,
    clientRef: { type: String, unique: true, sparse: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Block" }],
    visibility: {
      type: String,
      enum: ["private", "public"],
    },
  },
  { timestamps: true },
);
export type BoardDocument = mongoose.InferSchemaType<typeof boardSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const boardModel = mongoose.model("Board", boardSchema);
export default boardModel;
