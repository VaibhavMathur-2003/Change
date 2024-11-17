import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExercise extends Document {
  type: string;
  name: string;
  duration: number;
  intensity: string;
  equipment: string[];
  targetMuscleGroups: string[];
  description?: string;
  weeklyPlanIds: Types.ObjectId[];
}

const ExerciseSchema: Schema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, required: true },
  equipment: { type: [String], default: [] },
  targetMuscleGroups: { type: [String], default: [] },
  description: { type: String },
  weeklyPlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyPlan" }],
});

const Exercise = mongoose.models.Exercise || mongoose.model<IExercise>("Exercise", ExerciseSchema);

export default Exercise;
