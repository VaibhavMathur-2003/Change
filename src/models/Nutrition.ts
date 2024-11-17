import mongoose, { Schema, Document, Types } from "mongoose";

export interface INutrition extends Document {
  breakfast: string[]; // List of items to eat for breakfast
  lunch: string[]; // List of items to eat for lunch
  snack: string[]; // List of items to eat for a snack
  dinner: string[]; // List of items to eat for dinner
  mealsPerDay: number; // Total number of meals per day
  mealTimes?: string[]; // Preferred meal times (optional)
  weeklyPlanIds: Types.ObjectId[]; // References to WeeklyPlan
}

const NutritionSchema: Schema = new Schema({
  breakfast: { type: [String], default: [] },
  lunch: { type: [String], default: [] },
  snack: { type: [String], default: [] },
  dinner: { type: [String], default: [] },
  mealsPerDay: { type: Number, required: true, min: 1 },
  mealTimes: { type: [String], default: [] }, // Times formatted as "HH:MM" (e.g., "08:00", "13:00")
  weeklyPlanIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "WeeklyPlan" }],
});

const Nutrition = mongoose.models.Nutrition || mongoose.model<INutrition>("Nutrition", NutritionSchema);

export default Nutrition;
