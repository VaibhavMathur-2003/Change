import mongoose, { Schema, Document, Types } from "mongoose";

export interface IYoga extends Document {
  type: string;
  name: string;
  duration: number;
  intensity: string;
  equipment: string[];
  targetMuscleGroups: string[];
  description?: string;
  weeklyYogaPlanIds: Types.ObjectId[];
}

const YogaSchema: Schema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, required: true },
  equipment: { type: [String], default: [] },
  targetMuscleGroups: { type: [String], default: [] },
  description: { type: String },
  weeklyYogaPlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyYogaPlan" }],
});

const Yoga = mongoose.models.Yoga || mongoose.model<IYoga>("Yoga", YogaSchema);

export default Yoga;
