import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import Exercise from "../../../models/Exercise";
import WeeklyExercisePlans from "../../../models/WeeklyExercisePlan";
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

    // Find user and populate their weekly plans and exercises
    const user = await User.findOne({ uuid: userId })
      .populate({
        path: "weeklyExercisePlans",
        populate: {
          path: "Exercise",
          model: "Exercise",
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.weeklyExercisePlans && user.weeklyExercisePlans.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Retrieved existing exercise plan",
        data: user.weeklyExercisePlans,
        isExisting: true,
      });
    }

    let weeklyExercisePlan;
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
              "You are a professional fitness trainer specializing in creating personalized exercise plans. Consider the user's profile carefully when designing the plan, including their age, fitness level, goals, and any medical conditions or injuries. Ensure the exercises are appropriate and safe for their specific situation.",
          },
          {
            role: "user",
            content: `Create a personalized weekly exercise plan for the following user:

                ${userProfile}

                Training Parameters:
                - Recommended workout duration: ${fitnessParams.workoutDuration} minutes
                - Rest periods: ${fitnessParams.restPeriods}
                - Exercise complexity: ${fitnessParams.complexity}

                Create a balanced weekly plan that:
                - Matches their fitness level (${user.fitnessLevel})
                - Aligns with their goals (${user.goal || "General fitness"})
                - Considers any injuries or limitations (${user.injuries || "None"})
                - Includes appropriate progression
                - Provides adequate rest between muscle groups

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

      weeklyExercisePlan = parsedContent;
    } catch (error) {
      console.error("Error with Groq API:", error);
      return NextResponse.json(
        { success: false, message: "Failed to generate exercise plan" },
        { status: 500 }
      );
    }

    if (weeklyExercisePlan) {
      const savedPlans = await Promise.all(
        weeklyExercisePlan.map(async (dayPlan: any) => {
          const exercisePromises = dayPlan.exercises.map(
            async (exercise: any) => {
              const newExercise = new Exercise({
                type: exercise.type,
                name: exercise.name,
                duration: exercise.duration,
                intensity: exercise.intensity,
                equipment: exercise.equipment,
                targetMuscleGroups: exercise.targetMuscleGroups,
                description: exercise.description,
              });
              return await newExercise.save();
            }
          );

          const savedExercises = await Promise.all(exercisePromises);

          const newWeeklyExercisePlans = new WeeklyExercisePlans({
            userId: userId,
            day: dayPlan.day,
            Exercise: savedExercises.map((exercise) => exercise._id),
          });

          const savedWeeklyExercisePlans = await newWeeklyExercisePlans.save();

          await Promise.all(
            savedExercises.map((exercise) =>
              Exercise.findByIdAndUpdate(exercise._id, {
                $push: { weeklyExercisePlanIds: savedWeeklyExercisePlans._id },
              })
            )
          );

          await User.findOneAndUpdate(
            { uuid: userId },
            { $push: { weeklyExercisePlans: savedWeeklyExercisePlans._id } },
            { new: true }
          );

          return savedWeeklyExercisePlans;
        })
      );

      const newUserPlans = await User.findOne({ uuid: userId })
        .populate({
          path: "weeklyExercisePlans",
          populate: {
            path: "Exercise",
            model: "Exercise",
          },
        })
        .exec();

      return NextResponse.json({
        success: true,
        message:
          "Personalized weekly exercise plan generated and saved successfully",
        data: newUserPlans?.weeklyExercisePlans || [],
        isExisting: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate exercise plan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
