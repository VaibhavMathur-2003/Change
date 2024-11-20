import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMeditation extends Document {
  type: string;
  name: string;
  duration: number;
  description?: string;
  weeklyMeditationPlanIds: Types.ObjectId[];
}

const MeditationSchema: Schema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String },
  weeklyMeditationPlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyMeditationPlan" }],
});

const Meditation = mongoose.models.Meditation || mongoose.model<IMeditation>("Meditation", MeditationSchema);

export default Meditation;
