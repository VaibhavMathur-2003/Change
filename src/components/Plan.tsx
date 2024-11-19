"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Dumbbell, AlertCircle } from "lucide-react";

interface Exercise {
  type: string;
  name: string;
  duration: number;
  intensity: string;
  equipment: string[];
  targetMuscleGroups: string[];
  description?: string;
}

interface DayPlan {
    day: string;
    [key: string]: any; // Allow dynamic key for different plan types
  }
interface Props {
  plan: string;
}
export default function ExercisePlanGenerator({plan}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = React.useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("changeAuth");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchExercisePlan = async (currentUserId: string) => {
    if (!currentUserId) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    const storedUserId = localStorage.getItem("changeAuth");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchExercisePlan(storedUserId);
    }
  };
  useEffect(() => {
    if (userId) {
      generatePlan();
    }
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
                <h2 className="text-3xl font-bold mb-6">
                </h2>
                <div className="space-y-6">
                  {weeklyPlan[selectedDay][plan[0].toUpperCase() + plan.slice(1)]?.map((exercise: Exercise, index: string) => {
                    return (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center mb-3">
                          <Dumbbell className="h-8 w-8 text-purple-400 mr-3" />
                          <h3 className="text-xl font-semibold">
                            {exercise.name}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Type:</span>{" "}
                            {exercise.type}
                          </div>
                          <div>
                            <span className="text-gray-400">Duration:</span>{" "}
                            {exercise.duration} min
                          </div>
                          <div>
                            <span className="text-gray-400">Intensity:</span>{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                exercise.intensity === "High"
                                  ? "bg-red-900 text-red-200"
                                  : exercise.intensity === "Medium"
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-green-900 text-green-200"
                              }`}
                            >
                              {exercise.intensity}
                            </span>
                          </div>
                          {exercise.equipment && (
                            <div>
                              <span className="text-gray-400">Equipment:</span>{" "}
                              {exercise.equipment.join(", ")}
                            </div>
                          )}
                        </div>
                        {exercise.description && (
                          <p className="text-gray-200 mt-3 text-base">
                            {exercise.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </main>
          </div>
        ) : (
          <p className="text-center text-gray-400">No weekly plan available.</p>
        )}
      </div>
    </div>
  );
}
