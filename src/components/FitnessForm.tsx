"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Brain,
  Heart,
  Zap,
} from "lucide-react";
import { FormSubmit } from "@/actions/FormSubmit";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";

export default function FitnessForm() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("changeAuth")) {
      router.push("/dashboard");
    }
  }, [router]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    uuid: v4(),
    name: "",
    age: 25,
    gender: "",
    height: 170,
    weight: 70,
    goal: "",
    fitnessLevel: "",
    injuries: "",
  });

  const handleInputChange = (name: string, value: string | number) => {
    setFormData({ ...formData, [name]: value });
  };
  const handleAuth = () => {
    localStorage.setItem("changeAuth", formData.uuid);
  };

  const steps = [
    { title: "Basics", icon: <Zap className="w-8 h-8" /> },
    { title: "Body", icon: <Dumbbell className="w-8 h-8" /> },
    { title: "Goals", icon: <Brain className="w-8 h-8" /> },
    { title: "Health", icon: <Heart className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl p-8 rounded-2xl bg-gray-800 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          {steps.map((s, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index === step ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {s.icon}
              <span className="mt-2 text-sm">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  Your name?
                </Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter Name"
                    className="bg-gray-700 text-white border-purple-500"
                  />
                  <span className="text-4xl font-bold text-white">
                    {formData.name}
                  </span>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <Label className="text-2xl font-bold text-purple-400">
                  How old are you?
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[formData.age]}
                    onValueChange={(value) =>
                      handleInputChange("age", value[0])
                    }
                    max={100}
                    step={1}
                    className="flex-grow"
                  />
                  <span className="text-4xl font-bold text-white">
                    {formData.age}
                  </span>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  Whats your gender?
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex justify-between"
                >
                  {["Male", "Female", "Non-binary", "Prefer not to say"].map(
                    (gender) => (
                      <div key={gender} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={gender.toLowerCase()}
                          id={gender.toLowerCase()}
                        />
                        <Label
                          htmlFor={gender.toLowerCase()}
                          className="text-white"
                        >
                          {gender}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  How tall are you? (cm)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[formData.height]}
                    onValueChange={(value) =>
                      handleInputChange("height", value[0])
                    }
                    min={100}
                    max={250}
                    step={1}
                    className="flex-grow"
                  />
                  <span className="text-4xl font-bold text-white">
                    {formData.height}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  Whats your weight? (kg)
                </Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[formData.weight]}
                    onValueChange={(value) =>
                      handleInputChange("weight", value[0])
                    }
                    min={30}
                    max={200}
                    step={1}
                    className="flex-grow"
                  />
                  <span className="text-4xl font-bold text-white">
                    {formData.weight}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  Whats your primary fitness goal?
                </Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => handleInputChange("goal", value)}
                >
                  <SelectTrigger className="w-full bg-gray-700 text-white border-purple-500">
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-purple-500">
                    <SelectItem value="weightLoss">Weight Loss</SelectItem>
                    <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="flexibility">
                      Increase Flexibility
                    </SelectItem>
                    <SelectItem value="mentalWellness">
                      Enhance Mental Wellness
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-2xl font-bold text-purple-400">
                  Whats your current fitness level?
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={
                        formData.fitnessLevel === level.toLowerCase()
                          ? "default"
                          : "outline"
                      }
                      className={`h-20 ${
                        formData.fitnessLevel === level.toLowerCase()
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() =>
                        handleInputChange("fitnessLevel", level.toLowerCase())
                      }
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Label
                  htmlFor="injuries"
                  className="text-2xl font-bold text-purple-400"
                >
                  Any previous injuries or physical limitations?
                </Label>
                <Input
                  id="injuries"
                  type="text"
                  value={formData.injuries}
                  onChange={(e) =>
                    handleInputChange("injuries", e.target.value)
                  }
                  placeholder="Enter any injuries or limitations (if any)"
                  className="bg-gray-700 text-white border-purple-500"
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="bg-gray-700 hover:bg-gray-600"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <form action={FormSubmit} onSubmit={handleAuth}>
                <input type="hidden" name="uuid" value={formData.uuid} />
                <input type="hidden" name="name" value={formData.name} />
                <input type="hidden" name="age" value={formData.age} />
                <input type="hidden" name="height" value={formData.height} />
                <input type="hidden" name="weight" value={formData.weight} />
                <input type="hidden" name="gender" value={formData.gender} />
                <input type="hidden" name="goal" value={formData.goal} />
                <input
                  type="hidden"
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                />
                <input
                  type="hidden"
                  name="injuries"
                  value={formData.injuries}
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start My Fitness Journey
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
