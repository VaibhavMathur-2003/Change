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
    ) => `Provide only a valid JSON response. Do not include any additional text or commentary. 

      Generate a personalized weekly exercise plan for the user based on the provided details:

      User Profile:
      ${userProfile}

      Training Parameters:
      - Workout Duration: ${fitnessParams.workoutDuration} minutes per session
      - Rest Periods: ${fitnessParams.restPeriods}
      - Exercise Complexity: ${fitnessParams.complexity}

      Output the plan as a JSON array with the following structure:
      [
        {
          "day": "Monday",
          "exercises": [
            {
              "type": "strength",
              "name": "Exercise Name",
              "duration": 60,
              "intensity": "medium",
              "equipment": ["item1"],
              "targetMuscleGroups": ["muscle1"],
              "description": "Description of the exercise"
            }
          ]
        }
      ]

      Ensure the JSON is syntactically correct and adheres to the specified structure.`,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized exercise plans...",
  });
}
