import  { Document, Types } from 'mongoose';

export interface IUser extends Document {
  uuid: string;
  name?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal?: string;
  fitnessLevel?: string;
  injuries?: string;
  weeklyExercisePlans: Types.ObjectId[];
  weeklyYogaPlans: Types.ObjectId[];
  weeklyMeditationPlans: Types.ObjectId[];
  weeklyNutritionPlans: Types.ObjectId[];

}