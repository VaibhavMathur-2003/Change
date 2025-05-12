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
        type: item.type || "strength",
        name: item.name,
        duration: item.duration,
        intensity: item.intensity,
        equipment: item.equipment,
        targetMuscleGroups: item.targetMuscleGroups,
        description: item.description,
      });
      return await newYoga.save();
    },
    generateUserPrompt: (
      userProfile,
      fitnessParams
    ) => `Generate a personalized weekly yoga plan for the user based on the provided details.

Instructions:
- Provide only a valid JSON response.
- Do not include any text, headings, or commentary outside of the JSON.
- The JSON must be syntactically correct and match the exact structure below.

User Profile:
${userProfile}

Training Parameters:
- Recommended Workout Duration: ${fitnessParams.workoutDuration} minutes per session
- Rest Periods: ${fitnessParams.restPeriods}
- Yoga Complexity: ${fitnessParams.complexity}

Output Format:
Return a JSON array with the following structure:
[
  {
    "day": "Monday",
    "yogas": [
      {
        "type": "strength", // e.g., strength, flexibility, balance, relaxation
        "name": "Yoga Name",
        "duration": 45, // duration in minutes
        "intensity": "medium", // e.g., low, medium, high
        "equipment": ["yoga mat", "block"], // optional equipment
        "targetMuscleGroups": ["core", "legs"], // target areas
        "description": "Brief description of the yoga pose or sequence"
      }
    ]
  }
]

Additional Notes:
- Use a mix of yoga styles and sequences (e.g., Hatha, Vinyasa, Yin, etc.).
- Ensure logical progression through the week for mobility, strength, and rest.
- Poses should match the user’s skill level and yoga complexity preference.


    `,
    systemPrompt:
      `You are a certified yoga instructor and wellness coach. Your role is to create personalized, balanced weekly yoga plans tailored to each user's profile, fitness level, and preferences.

Consider the user's flexibility, goals (e.g., stress relief, strength building, balance), available workout duration, and rest requirements. Incorporate a range of yoga types, poses, and sequences, ensuring correct intensity and variety throughout the week.

You must provide only a valid, well-structured JSON array according to the user’s instructions. Do not include any extra commentary, explanations, or formatting—only the required JSON.

Ensure the yoga plan is appropriate for the user’s level (beginner, intermediate, advanced), and make sure that muscle groups and goals are balanced throughout the week.
Descriptions should be clear, concise, and realistic for a guided or self-led session.
`,
  });
}
