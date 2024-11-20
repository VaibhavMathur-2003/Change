import mongoose, { Schema, Document, Types } from "mongoose";

export interface INutrition extends Document {
  breakfast: string; // List of items to eat for breakfast
  lunch: string; // List of items to eat for lunch
  snack: string; // List of items to eat for a snack
  dinner: string; // List of items to eat for dinner
  mealTimes?: string; // Preferred meal times (optional)
  weeklyNutritionPlanIds: Types.ObjectId[]; // References to WeeklyPlan
}

const NutritionSchema: Schema = new Schema({
  breakfast: { type: String, default: "" },
  lunch: { type: String, default: "" },
  snack: { type: String, default: "" },
  dinner: { type: String, default: "" },
  mealTimes: { type: String, default: "" },
  weeklyNutritionPlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyNutritionPlan" }],
});

const Nutrition = mongoose.models.Nutrition || mongoose.model<INutrition>("Nutrition", NutritionSchema);

export default Nutrition;
