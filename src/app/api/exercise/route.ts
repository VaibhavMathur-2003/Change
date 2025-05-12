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
    ) => `You are a professional fitness trainer specializing in personalized weekly exercise plans.

    Task:
    Generate a personalized weekly exercise plan based on the user's profile and training parameters.

    Instructions:
    - Provide only a valid JSON response. Do not include any explanations, headings, or extra text.
    - Ensure the JSON is syntactically correct and adheres exactly to the specified structure.

    User Profile:
    ${userProfile}

    Training Parameters:
    - Workout Duration: ${fitnessParams.workoutDuration} minutes per session
    - Rest Periods: ${fitnessParams.restPeriods}
    - Exercise Complexity: ${fitnessParams.complexity}

    Output Format:
    Return a JSON array with the structure:
    [
      {
        "day": "Monday",
        "exercises": [
          {
            "type": "strength", // e.g., strength, cardio, flexibility, etc.
            "name": "Exercise Name",
            "duration": 30, // duration in minutes
            "intensity": "medium", // e.g., low, medium, high
            "equipment": ["item1", "item2"], // list of equipment used
            "targetMuscleGroups": ["muscle1", "muscle2"], // affected muscles
            "description": "Brief description of the exercise"
          }
        ]
      }
    ]

    Additional Notes:
    - Include exercises appropriate to the user's goals, fitness level, and any limitations from their profile.
    - Ensure a balanced variety of exercise types across the week.
    - Vary target muscle groups to allow for proper recovery.
`,
    systemPrompt:
      "You are a certified personal fitness trainer and exercise physiologist. Your role is to design safe, effective, and personalized weekly workout plans for clients of all fitness levels. You take into account the user’s fitness goals, physical condition, and training preferences to create balanced weekly routines. Your plans include a variety of exercise types (strength, cardio, flexibility, etc.) with appropriate intensity, muscle targeting, and recovery periods. Each session is tailored for maximum benefit and safety. You must output only a valid and properly formatted JSON object or array that exactly matches the structure specified in the user prompt. Do not include explanations, headers, markdown, or any extra commentary—just return the JSON. All exercise names, durations, intensities, equipment, and descriptions must be realistic, clear, and appropriately personalized to the user’s input data. Use variety and ensure logical distribution of exercise types and muscle focus across the week.Be concise and accurate in all descriptions and values. Prioritize correct structure and full syntactic validity of the JSON.",
  });
}
