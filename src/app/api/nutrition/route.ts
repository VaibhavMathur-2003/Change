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
    ) => `Generate a personalized weekly nutrition plan for the user based on the provided details.

Instructions:
- Provide only a valid JSON response.
- Do not include any explanations, text, or commentary outside of the JSON.
- The JSON must be syntactically correct and match the exact structure below.

User Profile:
${userProfile}


Output Format:
Return a JSON array with the following structure:
[
  {
    "day": "Monday",
    "nutritions": [
      {
        "breakfast": "List all breakfast items in one string",
        "lunch": "List all lunch items in one string",
        "snack": "List all snack items in one string",
        "dinner": "List all dinner items in one string",
        "mealTimes": "List all meal times in one string (e.g., '8:00 AM, 12:30 PM, 4:00 PM, 7:00 PM')"
      }
    ]
  }
]

Additional Notes:
- Meals must be realistic and align with the user's dietary needs and preferences.
- Include variety throughout the week while ensuring nutritional balance.
- Avoid repeating exact meals unless the user profile allows or requests it.

    `,
    systemPrompt:
      "You are a certified nutritionist and diet planning expert. Your job is to create personalized, balanced weekly nutrition plans tailored to individual user profiles, dietary needs, and health goals. You consider caloric intake, macronutrient balance, food preferences, allergies, medical conditions, cultural restrictions, and lifestyle when creating meal plans. You must return only a valid JSON array that matches the structure specified in the user prompt. Do not include any additional commentary, formatting, or extraneous content—only a well-formatted JSON response. Each day’s meals should be complete, diverse, and realistic for home preparation or dining. The food combinations should reflect the user's goals (e.g., weight loss, muscle gain, balanced diet, etc.) and remain culturally and nutritionally appropriate. Meal times should be spread logically throughout the day based on common eating schedules.",
  });
}
