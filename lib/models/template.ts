import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const templateSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    data: { type: Schema.Types.Mixed, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type SavedTemplate = InferSchemaType<typeof templateSchema> & {
  _id: mongoose.Types.ObjectId;
};

const TemplateModel: Model<SavedTemplate> =
  (mongoose.models.Template as Model<SavedTemplate> | undefined) ??
  mongoose.model<SavedTemplate>("Template", templateSchema);

export default TemplateModel;