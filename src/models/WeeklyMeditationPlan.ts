import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyMeditationPlan extends Document {
  userId: string;
  day: string;
  Meditation: Types.ObjectId[];
}

const WeeklyMeditationPlanSchema: Schema = new Schema({
  userId: { type: String, ref: "User", required: true },
  day: { type: String, required: true },
  Meditation: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meditation" }],
});

// Export the WeeklyMeditationPlan model
const WeeklyMeditationPlan =
  mongoose.models.WeeklyMeditationPlan ||
  mongoose.model<IWeeklyMeditationPlan>(
    "WeeklyMeditationPlan",
    WeeklyMeditationPlanSchema
  );

export default WeeklyMeditationPlan;
