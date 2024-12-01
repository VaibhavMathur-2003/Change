/* eslint-disable @typescript-eslint/no-explicit-any */

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
    createItem: async (item: any) => {
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
    ) => `Provide only a valid JSON response. Do not include any additional text or commentary.

      Generate a personalized weekly yoga plan for the user based on the provided details:

      User Profile:
      ${userProfile}

      Training Parameters:
      - Recommended Workout Duration: ${fitnessParams.workoutDuration} minutes per session
      - Rest Periods: ${fitnessParams.restPeriods}
      - Yoga Complexity: ${fitnessParams.complexity}

      Output the plan as a JSON array with the following structure:
      [
        {
          "day": "Monday",
          "yogas": [
            {
              "type": "strength",
              "name": "Yoga Name",
              "duration": 60,
              "intensity": "medium",
              "equipment": ["item1"],
              "targetMuscleGroups": ["muscle1"],
              "description": "Description of the yoga pose or flow"
            }
          ]
        }
      ]

      Ensure the JSON is syntactically correct and adheres to the specified structure.

    `,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized yoga plans...",
  });
}
