"use server";
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";

export const FormSubmit = async (formData: FormData) => {
  await connectToMongoDB();
  const uuid = formData.get("uuid") as string;
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10) || 0;
  const gender = (formData.get("gender") as string) || "prefer-not-to-say";
  const height = parseFloat(formData.get("height") as string) || 0;
  const weight = parseFloat(formData.get("weight") as string) || 0;
  const goal = formData.get("goal") as string;
  const injuries = formData.get("injuries") as string;
  const fitnessLevel = formData.get("fitnessLevel") as string;
  try {
    const newUser = await User.create({
      uuid: uuid,
      name: name || null,
      age,
      gender,
      height,
      weight,
      goal,
      injuries: injuries || "No",
      fitnessLevel: fitnessLevel || "beginner",
    });
    await newUser.save();
  
} catch (error) {
    console.log(error);
  }
};
