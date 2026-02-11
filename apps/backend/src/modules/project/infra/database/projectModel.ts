import mongoose from "mongoose";
import type { BoardDocument } from "@/modules/board/infra/database/boardModel";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    userId: String,
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true }
);

export const projectModel = mongoose.model("Project", projectSchema);
export type ProjectDocument = mongoose.InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
  boards: BoardDocument[];
};
export default projectModel;
