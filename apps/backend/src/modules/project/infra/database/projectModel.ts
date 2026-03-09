import mongoose from "mongoose";
import type { BoardDocument } from "@/modules/board/infra/database/boardModel";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    userId: String,
    clientRef: { type: String, unique: true, sparse: true },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true },
);

export const projectModel = mongoose.model("Project", projectSchema);
type ProjectSchema = mongoose.InferSchemaType<typeof projectSchema>;

export type ProjectDocument = mongoose.HydratedDocument<
  ProjectSchema,
  { boards: (mongoose.Types.ObjectId | BoardDocument)[] }
>;
export default projectModel;
