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
      userProfile,
    ) => `Create a personalized weekly meditation plan for the following user:
      ${userProfile}
                Return only valid JSON array with this structure:
                [{
                  "day": "Monday",
                  "meditations": [{
                    "type": "mind relax",
                    "name": "Meditation Name",
                    "duration": 30,
                    "description": "Description"
                  }]
                }],
    `,
    systemPrompt:
      "You are a professional fitness trainer specializing in creating personalized meditation plans...",
  });
}
