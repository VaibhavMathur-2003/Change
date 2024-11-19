import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWeeklyYogaPlan extends Document {
  userId: string;
  day: string;
  Yoga: Types.ObjectId[];
}

const WeeklyYogaPlanSchema: Schema = new Schema({
  userId: { type: String, ref: "User", required: true },
  day: { type: String, required: true },
  Yoga: [{ type: mongoose.Schema.Types.ObjectId, ref: "Yoga" }],
});

// Export the WeeklyYogaPlan model
const WeeklyYogaPlan =
  mongoose.models.WeeklyYogaPlan ||
  mongoose.model<IWeeklyYogaPlan>("WeeklyYogaPlan", WeeklyYogaPlanSchema);

export default WeeklyYogaPlan;
