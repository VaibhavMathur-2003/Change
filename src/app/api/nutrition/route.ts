/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from "next/server";
import { generatePersonalizedPlan } from "@/actions/PlanGenerate";
import Nutrition from "../../../models/Nutrition";
import WeeklyNutritionPlans from "../../../models/WeeklyNutritionPlan";
import User from "../../../models/User";

export async function POST(req: NextRequest) {
  return generatePersonalizedPlan(req, {
    userModel: User,
    planModel: WeeklyNutritionPlans,
    itemModel: Nutrition,
    planType: "Nutrition",
    createItem: async (item: any) => {
      const newNutrition = new Nutrition({
        breakfast: item.breakfast || [],
        lunch: item.lunch || [],
        snack: item.snack || [],
        dinner: item.dinner || [],
        mealTimes: item.mealTimes || ["08:00", "13:00", "18:00"],
      });
      return await newNutrition.save();
    },
    generateUserPrompt: (
      userProfile,
    ) => `Just return a json. NO other text. Create a personalized weekly nutrition plan for the following user:

      ${userProfile}

      Dietary Parameters:
    
                Return only valid JSON array with this structure:
                [{
                  "day": "Monday",
                   "nutritions": [{
                    "breakfast": "all items (string only)",
                    "lunch": "all items (string only)",
                    "snack": "all items (string only)",
                    "dinner": "all items (string only)",
                    "mealTimes": "all items (string only)"
                  }]
                }],
    `,
    systemPrompt:
      "You are a professional nutritionist specializing in creating personalized meal plans...",
  });
}
