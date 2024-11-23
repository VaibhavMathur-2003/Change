"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Dumbbell, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseActivity {
  name: string;
  type: string;
  duration: number;
  intensity: string;
  description?: string;
}

interface Exercise extends BaseActivity {
  equipment: string[];
  targetMuscleGroups: string[];
}

interface Nutrition extends BaseActivity {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  mealTimes?: string;
}

type Activity = Exercise | Nutrition;

interface DayPlan {
  day: string;
  Exercise?: Exercise[];
  Nutrition?: Nutrition[];
  [key: string]: unknown;
}

interface Props {
  plan: 'exercise' | 'nutrition' | 'yoga' | 'meditation'; 
}

export default function ExercisePlanGenerator({ plan }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("changeAuth");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchExercisePlan = async (currentUserId: string) => {
    if (!currentUserId) return;
    setError(null);

    try {
      const response = await fetch(`/api/${plan}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch exercise plan");
      }

      const data = await response.json();
      setWeeklyPlan(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  const generatePlan = async () => {
    const storedUserId = localStorage.getItem("changeAuth");
    if (storedUserId) {
      setUserId(storedUserId);
      await fetchExercisePlan(storedUserId);
    }
  };

  useEffect(() => {
    if (userId) {
      generatePlan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userId) {
    return (
      <Card className="mx-auto max-w-md mt-8">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              User ID not found. Please log in to generate an exercise plan.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const planKey = plan[0].toUpperCase() + plan.slice(1);
  const currentDayPlan = weeklyPlan?.[selectedDay]?.[planKey] as Activity[] | undefined;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Weekly {plan} Plan
          </h1>
          <p className="text-xl text-gray-400 mt-4">
            Elevate your fitness journey with personalized routines
          </p>
        </header>

        {error && (
          <div className="max-w-lg mx-auto mb-8 bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {weeklyPlan ? (
          <div className="flex flex-col lg:flex-row gap-16">
            <nav className="lg:w-1/4">
              <ul className="space-y-2">
                {weeklyPlan.map((day, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setSelectedDay(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedDay === index
                          ? "bg-purple-700 text-white"
                          : "text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <Calendar className="inline-block mr-2" />
                      {day.day}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <main className="lg:w-3/4">
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-3xl font-bold mb-6"></h2>
                <div className="space-y-6">
                  {currentDayPlan?.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <Dumbbell className="h-8 w-8 text-purple-400 mr-3" />
                        {activity.name && (
                          <h3 className="text-xl font-semibold">
                            {activity.name}
                          </h3>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {activity.type && (
                          <div>
                            <span className="text-gray-400">Type: </span>
                            {activity.type}
                          </div>
                        )}
                        {activity.duration && (
                          <div>
                            <span className="text-gray-400">Duration: </span>
                            {activity.duration} min
                          </div>
                        )}
                        {activity.intensity && (
                          <div>
                            <span className="text-gray-400">Intensity: </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                activity.intensity === "High"
                                  ? "bg-red-900 text-red-200"
                                  : activity.intensity === "Medium"
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-green-900 text-green-200"
                              }`}
                            >
                              {activity.intensity}
                            </span>
                          </div>
                        )}
                        {'equipment' in activity && (
                          <div>
                            <span className="text-gray-400">Equipment: </span>
                            {activity.equipment.join(", ")}
                          </div>
                        )}
                      </div>
                      {activity.description && (
                        <p className="text-gray-200 mt-3 text-base">
                          {activity.description}
                        </p>
                      )}

                      {'breakfast' in activity && (
                        <div className="grid grid-cols-1 gap-4 text-base">
                          <div>
                            <span className="text-gray-400">Breakfast: </span>
                            {activity.breakfast}
                          </div>
                          <div>
                            <span className="text-gray-400">Lunch: </span>
                            {activity.lunch}
                          </div>
                          <div>
                            <span className="text-gray-400">Snack: </span>
                            {activity.snack}
                          </div>
                          <div>
                            <span className="text-gray-400">Dinner: </span>
                            {activity.dinner}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </main>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin w-full mx-auto")}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
      </div>
    </div>
  );
}