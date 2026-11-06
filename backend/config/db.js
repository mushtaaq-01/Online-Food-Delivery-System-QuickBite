import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/food-del";
    await mongoose.connect(mongoUri);
    console.log("DB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
  }
};
