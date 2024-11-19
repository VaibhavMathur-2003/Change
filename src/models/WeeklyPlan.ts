import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyPlan extends Document {
  userId: string;
  day: string;
  ExercisePlans: Types.ObjectId[];
  Nutrition: Types.ObjectId[];
  Yoga: Types.ObjectId[];
  Meditation: Types.ObjectId[];
}

const WeeklyPlanSchema: Schema = new Schema({
  userId: { type: String, ref: "User", required: true },
  day: { type: String, required: true },
  Exercise: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  Nutrition: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nutrition" }],
  Yoga: [{ type: mongoose.Schema.Types.ObjectId, ref: "Yoga" }],
  Meditation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meditation" }],
});

// Export the WeeklyPlan model
const WeeklyPlan = mongoose.models.WeeklyPlan || mongoose.model<IWeeklyPlan>("WeeklyPlan", WeeklyPlanSchema);

export default WeeklyPlan;
