import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    userId: String,
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true }
);

export const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
