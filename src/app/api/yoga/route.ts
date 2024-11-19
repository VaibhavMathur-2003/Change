import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import Yoga from "../../../models/Yoga";
import WeeklyYogaPlans from "../../../models/WeeklyYogaPlan";
import User from "../../../models/User";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MONGODB_URI = process.env.DATABASE_URL;

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI!);
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and populate their weekly plans and yogas
    const user = await User.findOne({ uuid: userId })
      .populate({
        path: "weeklyYogaPlans",
        populate: {
          path: "Yoga",
          model: "Yoga",
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.weeklyYogaPlans && user.weeklyYogaPlans.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Retrieved existing yoga plan",
        data: user.weeklyYogaPlans,
        isExisting: true,
      });
    }

    let weeklyYogaPlan;
    try {
      const userProfile = `
            Age: ${user.age}
            Gender: ${user.gender}
            Height: ${user.height}cm
            Weight: ${user.weight}kg
            Fitness Level: ${user.fitnessLevel}
            Fitness Goals: ${user.goal || "General fitness"}
            Medical Conditions/Injuries: ${user.injuries || "None"}
      `.trim();

      const intensityMap = {
        beginner: {
          workoutDuration: "20-30",
          restPeriods: "longer",
          complexity: "basic",
        },
        intermediate: {
          workoutDuration: "30-45",
          restPeriods: "moderate",
          complexity: "moderate",
        },
        advanced: {
          workoutDuration: "45-60",
          restPeriods: "shorter",
          complexity: "advanced",
        },
      };

      const fitnessParams =
        intensityMap[user.fitnessLevel as keyof typeof intensityMap] ||
        intensityMap.beginner;

      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are a professional fitness trainer specializing in creating personalized yoga plans. Consider the user's profile carefully when designing the plan, including their age, fitness level, goals, and any medical conditions or injuries. Ensure the yogas are appropriate and safe for their specific situation.",
          },
          {
            role: "user",
            content: `Create a personalized weekly yoga plan for the following user:

                ${userProfile}

                Training Parameters:
                - Recommended workout duration: ${fitnessParams.workoutDuration} minutes
                - Rest periods: ${fitnessParams.restPeriods}
                - Yoga complexity: ${fitnessParams.complexity}

                Create a balanced weekly plan that:
                - Matches their fitness level (${user.fitnessLevel})
                - Aligns with their goals (${user.goal || "General fitness"})
                - Considers any injuries or limitations (${user.injuries || "None"})
                - Includes appropriate progression

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
                }]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Groq API");
      }

      const parsedContent = JSON.parse(completion.choices[0].message.content);
      if (!Array.isArray(parsedContent)) {
        throw new Error("Invalid response format: not an array");
      }

      weeklyYogaPlan = parsedContent;
    } catch (error) {
      console.error("Error with Groq API:", error);
      return NextResponse.json(
        { success: false, message: "Failed to generate yoga plan" },
        { status: 500 }
      );
    }

    if (weeklyYogaPlan) {
      const savedPlans = await Promise.all(
        weeklyYogaPlan.map(async (dayPlan: any) => {
          const yogaPromises = dayPlan.yogas.map(
            async (yoga: any) => {
              const newYoga = new Yoga({
                type: yoga.type,
                name: yoga.name,
                duration: yoga.duration,
                intensity: yoga.intensity,
                equipment: yoga.equipment,
                targetMuscleGroups: yoga.targetMuscleGroups,
                description: yoga.description,
              });
              return await newYoga.save();
            }
          );

          const savedYogas = await Promise.all(yogaPromises);

          const newWeeklyYogaPlan = new WeeklyYogaPlans({
            userId: userId,
            day: dayPlan.day,
            Yoga: savedYogas.map((yoga) => yoga._id),
          });

          const savedWeeklyYogaPlan = await newWeeklyYogaPlan.save();

          await Promise.all(
            savedYogas.map((yoga) =>
              Yoga.findByIdAndUpdate(yoga._id, {
                $push: { weeklyYogaPlanIds: savedWeeklyYogaPlan._id },
              })
            )
          );

          await User.findOneAndUpdate(
            { uuid: userId },
            { $push: { weeklyYogaPlans: savedWeeklyYogaPlan._id } },
            { new: true }
          );

          return savedWeeklyYogaPlan;
        })
      );

      const newUserPlans = await User.findOne({ uuid: userId })
        .populate({
          path: "weeklyYogaPlans",
          populate: {
            path: "Yoga",
            model: "Yoga",
          },
        })
        .exec();

      return NextResponse.json({
        success: true,
        message:
          "Personalized weekly yoga plan generated and saved successfully",
        data: newUserPlans?.weeklyYogaPlans || [],
        isExisting: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate yoga plan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
