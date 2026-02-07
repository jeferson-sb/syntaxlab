import { boardSchema } from "@/modules/board/infra/database/boardModel";
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    userId: String,
    boards: [boardSchema],
  },
  { timestamps: true }
);

export const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
