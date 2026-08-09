import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const projectSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    template: { type: Schema.Types.Mixed, required: true },
    profile: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

projectSchema.index({ user: 1, updatedAt: -1 });

export type Project = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ProjectModel: Model<Project> =
  (mongoose.models.Project as Model<Project> | undefined) ??
  mongoose.model<Project>("Project", projectSchema);

export default ProjectModel;