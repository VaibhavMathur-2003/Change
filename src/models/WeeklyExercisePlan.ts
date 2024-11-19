import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyExercisePlan extends Document {
  userId: string;
  day: string;
  ExercisePlans: Types.ObjectId[];
}

const WeeklyExercisePlanSchema: Schema = new Schema({
  userId: { type: String, ref: "User", required: true },
  day: { type: String, required: true },
  Exercise: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
});

// Export the WeeklyExercisePlan model
const WeeklyExercisePlan =
  mongoose.models.WeeklyExercisePlan ||
  mongoose.model<IWeeklyExercisePlan>(
    "WeeklyExercisePlan",
    WeeklyExercisePlanSchema
  );

export default WeeklyExercisePlan;
