import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
