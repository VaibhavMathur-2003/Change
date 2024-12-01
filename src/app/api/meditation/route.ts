/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { generatePersonalizedPlan } from "@/actions/PlanGenerate";
import Meditation from "../../../models/Meditation";
import WeeklyMeditationPlans from "../../../models/WeeklyMeditationPlan";
import User from "../../../models/User";

export async function POST(req: NextRequest) {
  return generatePersonalizedPlan(req, {
    userModel: User,
    planModel: WeeklyMeditationPlans,
    itemModel: Meditation,
    planType: "Meditation",
    createItem: async (item: any) => {
      const newMeditation = new Meditation({
        type: item.type || "relaxation",
        name: item.name,
        duration: item.duration,
        description: item.description,
      });
      return await newMeditation.save();
    },
    generateUserPrompt: (
      userProfile
    ) => `Provide only a valid JSON response. Do not include any additional text or commentary.

      Generate a personalized weekly meditation plan for the user based on the provided details:

      User Profile:
      ${userProfile}

      Output the plan as a JSON array with the following structure:
      [
        {
          "day": "Monday",
          "meditations": [
            {
              "type": "mind relax",
              "name": "Meditation Name",
              "duration": 60,
              "description": "Description of the meditation"
            }
          ]
        }
      ]

      Ensure the JSON is syntactically correct and adheres to the specified structure.

    `,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized meditation plans...",
  });
}
