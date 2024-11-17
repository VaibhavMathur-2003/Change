import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  name?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal?: string;
  fitnessLevel?: string;
  injuries?: string;
  weeklyPlans: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
  uuid: { type: String, unique: true, required: true },
  name: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String},
  fitnessLevel: { type: String, default: "beginner" },
  injuries: { type: String, default: "No" },
  weeklyPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyPlan" }]
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
