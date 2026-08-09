import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const CARD_FORMATS = ["png", "jpg", "pdf", "zip"] as const;
export type CardFormat = (typeof CARD_FORMATS)[number];

const cardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: false },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    format: { type: String, enum: CARD_FORMATS, required: true },
    fileName: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 },
    verifyId: { type: String, default: "", index: true },
    profile: { type: Schema.Types.Mixed },
    template: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

cardSchema.index({ user: 1, createdAt: -1 });

export type GeneratedCard = InferSchemaType<typeof cardSchema> & {
  _id: mongoose.Types.ObjectId;
};

const GeneratedCardModel: Model<GeneratedCard> =
  (mongoose.models.GeneratedCard as Model<GeneratedCard> | undefined) ??
  mongoose.model<GeneratedCard>("GeneratedCard", cardSchema);

export default GeneratedCardModel;