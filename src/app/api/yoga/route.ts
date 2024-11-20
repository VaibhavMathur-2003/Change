import { NextRequest } from "next/server";
import { generatePersonalizedPlan } from "@/actions/PlanGenerate";
import Yoga from "../../../models/Yoga";
import WeeklyYogaPlans from "../../../models/WeeklyYogaPlan";
import User from "../../../models/User";

export async function POST(req: NextRequest) {
  return generatePersonalizedPlan(req, {
    userModel: User,
    planModel: WeeklyYogaPlans,
    itemModel: Yoga,
    planType: "Yoga",
    createItem: async (item) => {
      const newYoga = new Yoga({
        // Custom logic for yoga creation
        type: item.type || "strength",
        name: item.name,
        duration: item.duration,
        intensity: item.intensity,
        equipment: item.equipment,
        targetMuscleGroups: item.targetMuscleGroups,
        description: item.description,
        // Add any additional custom fields
      });
      return await newYoga.save();
    },
    generateUserPrompt: (
      userProfile,
      fitnessParams
    ) => `Just return a json. NO other text. Create a personalized weekly yoga plan for the following user:

      ${userProfile}

      Training Parameters:
      - Recommended workout duration: ${fitnessParams.workoutDuration} minutes
      - Rest periods: ${fitnessParams.restPeriods}
      - Yoga complexity: ${fitnessParams.complexity}

                Return only valid JSON array with this structure:
                [{
                  "day": "Monday",
                  "yogas": [{
                    "type": "strength",
                    "name": "Yoga Name",
                    "duration": 30,
                    "intensity": "medium",
                    "equipment": ["item1"],
                    "targetMuscleGroups": ["muscle1"],
                    "description": "Description"
                  }]
                }],
    `,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized yoga plans...",
  });
}
