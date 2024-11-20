import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyNutritionPlan extends Document {
  userId: string;
  day: string;
  Nutrition: Types.ObjectId[];
}

const WeeklyNutritionPlanSchema: Schema = new Schema({
  userId: { type: String, ref: "User", required: true },
  day: { type: String, required: true },
  Nutrition: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nutrition" }],
});

// Export the WeeklyNutritionPlan model
const WeeklyNutritionPlan =
  mongoose.models.WeeklyNutritionPlan ||
  mongoose.model<IWeeklyNutritionPlan>("WeeklyNutritionPlan", WeeklyNutritionPlanSchema);

export default WeeklyNutritionPlan;
