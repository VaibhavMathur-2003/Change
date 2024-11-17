import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyPlan extends Document {
  userId: Types.ObjectId;
  day: string;
  WeeklyPlans: Types.ObjectId[];
  nutrition: Types.ObjectId[];
  yoga: Types.ObjectId[];
  meditation: Types.ObjectId[];
}

const WeeklyPlanSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: String, required: true },
  WeeklyPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyPlan" }],
  nutrition: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nutrition" }],
  yoga: [{ type: mongoose.Schema.Types.ObjectId, ref: "Yoga" }],
  meditation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meditation" }],
});

// Export the WeeklyPlan model
const WeeklyPlan = mongoose.models.WeeklyPlan || mongoose.model<IWeeklyPlan>("WeeklyPlan", WeeklyPlanSchema);

export default WeeklyPlan;
