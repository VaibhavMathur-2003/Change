/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { generatePersonalizedPlan } from "@/actions/PlanGenerate";
import Exercise from "../../../models/Exercise";
import WeeklyExercisePlans from "../../../models/WeeklyExercisePlan";
import User from "../../../models/User";

export async function POST(req: NextRequest) {
  return generatePersonalizedPlan(req, {
    userModel: User,
    planModel: WeeklyExercisePlans,
    itemModel: Exercise,
    planType: "Exercise",
    createItem: async (item: any) => {
      const newExercise = new Exercise({
        type: item.type || "strength",
        name: item.name,
        duration: item.duration,
        intensity: item.intensity,
        equipment: item.equipment,
        targetMuscleGroups: item.targetMuscleGroups,
        description: item.description,
      });
      return await newExercise.save();
    },
    generateUserPrompt: (
      userProfile,
      fitnessParams
    ) => `Just return a json. NO other text. Create a personalized weekly exercise plan for the following user:

      ${userProfile}

      Training Parameters:
      - Recommended workout duration: ${fitnessParams.workoutDuration} minutes
      - Rest periods: ${fitnessParams.restPeriods}
      - Exercise complexity: ${fitnessParams.complexity}

                Return only valid JSON array with this structure:
                [{
                  "day": "Monday",
                  "exercises": [{
                    "type": "strength",
                    "name": "Exercise Name",
                    "duration": 30,
                    "intensity": "medium",
                    "equipment": ["item1"],
                    "targetMuscleGroups": ["muscle1"],
                    "description": "Description"
                  }]
                }],
    `,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized exercise plans...",
  });
}
