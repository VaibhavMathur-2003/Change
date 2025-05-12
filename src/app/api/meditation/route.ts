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
    ) => `Generate a personalized weekly meditation plan for the user based on the provided details.

    Instructions:
    - Provide only a valid JSON response.
    - Do not include any explanations, headings, or additional text.
    - The output must be syntactically correct and match the exact structure below.

    User Profile:
    ${userProfile}

    Output Format:
    Return a JSON array with the following structure:
    [
      {
        "day": "Monday",
        "meditations": [
          {
            "type": "mind relax", // e.g., mindfulness, breathwork, visualization, body scan
            "name": "Meditation Name",
            "duration": 20, // duration in minutes
            "description": "Brief description of the meditation session"
          }
        ]
      }
    ]

    Additional Notes:
    - Include a variety of meditation types throughout the week.
    - Tailor sessions to match the user's emotional and mental wellness goals.
    - Ensure descriptions are concise and easy to understand.


    `,
    systemPrompt:
      "You are a certified meditation coach and mental wellness expert. Your role is to design personalized weekly meditation plans that help users improve mindfulness, relaxation, emotional clarity, and overall mental well-being.You tailor each session based on the user's profile, preferences, and mental health goals. Sessions may include practices such as mindfulness, breathwork, visualization, loving-kindness, or body scan meditations.You must output only a valid and properly formatted JSON array. Do not include any extra commentary, headings, or markdown formatting. Ensure that your JSON strictly matches the structure provided in the user prompt.Each day's entry should be thoughtful, varied, and appropriate to the user's needs. Meditation descriptions should be clear, brief, and realistic for guided or self-led sessions.",
  });
}
