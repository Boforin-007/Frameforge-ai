import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    organization: { type: String, default: "", maxlength: 120 },
    avatarUrl: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

const UserModel: Model<User> =
  (mongoose.models.User as Model<User> | undefined) ??
  mongoose.model<User>("User", userSchema);

export default UserModel;