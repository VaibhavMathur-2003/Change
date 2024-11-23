/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import User from "@/models/User";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MONGODB_URI = process.env.DATABASE_URL;

const groq = new Groq({ apiKey: GROQ_API_KEY });

interface FitnessPlanConfig {
  userModel: mongoose.Model<any>;
  planModel: mongoose.Model<any>;
  itemModel: mongoose.Model<any>;
  planType: string;
  createItem: (item: any) => Promise<mongoose.Document>;
  generateUserPrompt: (userProfile: string, fitnessParams: any) => string;
  systemPrompt: string;
}

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI!);
}

export async function generatePersonalizedPlan(
  req: NextRequest, 
  config: FitnessPlanConfig
) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ uuid: userId })
      .populate({
        path: `weekly${config.planType}Plans`,
        populate: {
          path: config.planType,
          model: config.planType,
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check for existing plan
    const existingPlans = user[`weekly${config.planType}Plans`];
    if (existingPlans && existingPlans.length > 0) {
      return NextResponse.json({
        success: true,
        message: `Retrieved existing ${config.planType.toLowerCase()} plan`,
        data: existingPlans,
        isExisting: true,
      });
    }

    // Generate user profile and fitness parameters
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
        workoutDuration: "30-45",
        restPeriods: "longer",
        complexity: "basic",
      },
      intermediate: {
        workoutDuration: "60-75",
        restPeriods: "moderate",
        complexity: "moderate",
      },
      advanced: {
        workoutDuration: "75-90",
        restPeriods: "shorter",
        complexity: "advanced",
      },
    };

    const fitnessParams =
      intensityMap[user.fitnessLevel as keyof typeof intensityMap] ||
      intensityMap.beginner;

    // Generate plan using Groq API
    let weeklyPlan;
    try {
      const completion = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: config.systemPrompt,
          },
          {
            role: "user",
            content: config.generateUserPrompt(userProfile, fitnessParams),
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

      weeklyPlan = parsedContent;
    } catch (error) {
      console.error(`Error with Groq API for ${config.planType}:`, error);
      return NextResponse.json(
        { success: false, message: `Failed to generate ${config.planType.toLowerCase()} plan` },
        { status: 500 }
      );
    }

    // Save generated plan
    if (weeklyPlan) {
      
      await Promise.all(
        weeklyPlan.map(async (dayPlan: any) => {
          console.log(config.planType)
          const itemPromises = dayPlan[`${config.planType.toLowerCase()}s`].map(
            async (item: any) => await config.createItem(item)
          );

          const savedItems = await Promise.all(itemPromises);

          const newWeeklyPlan = new config.planModel({
            userId: userId,
            day: dayPlan.day,
            [config.planType]: savedItems.map((item) => item._id),
          });

          const savedWeeklyPlan = await newWeeklyPlan.save();

          await Promise.all(
            savedItems.map((item) =>
              config.itemModel.findByIdAndUpdate(item._id, {
                $push: { [`weekly${config.planType}PlanIds`]: savedWeeklyPlan._id },
              })
            )
          );

          await User.findOneAndUpdate(
            { uuid: userId },
            { $push: { [`weekly${config.planType}Plans`]: savedWeeklyPlan._id } },
            { new: true }
          );

          return savedWeeklyPlan;
        })
      );

      const newUserPlans = await User.findOne({ uuid: userId })
        .populate({
          path: `weekly${config.planType}Plans`,
          populate: {
            path: config.planType,
            model: config.planType,
          },
        })
        .exec();

      return NextResponse.json({
        success: true,
        message: `Personalized weekly ${config.planType.toLowerCase()} plan generated and saved successfully`,
        data: newUserPlans?.[`weekly${config.planType}Plans`] || [],
        isExisting: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to generate ${config.planType.toLowerCase()} plan`,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}