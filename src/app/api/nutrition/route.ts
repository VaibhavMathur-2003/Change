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
    ) => `Provide only a valid JSON response. Do not include any additional text or commentary.

        Generate a personalized weekly nutrition plan for the user based on the provided details:

        User Profile:
        ${userProfile}

        Dietary Parameters:
        <Add any specific dietary parameters if applicable>

        Output the plan as a JSON array with the following structure:
        [
          {
            "day": "Monday",
            "nutritions": [
              {
                "breakfast": "List all items as a single string",
                "lunch": "List all items as a single string",
                "snack": "List all items as a single string",
                "dinner": "List all items as a single string",
                "mealTimes": "List all meal times as a single string"
              }
            ]
          }
        ]

        Ensure the JSON is syntactically correct and adheres to the specified structure.

    `,
    systemPrompt:
      "You are a professional nutritionist specializing in creating personalized meal plans...",
  });
}
