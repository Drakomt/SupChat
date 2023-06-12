import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
    console.error(`Error: ${err}`);
});

export const mongoConnect = async () => {
    await mongoose.connect(MONGODB_URI);
};

export const mongoDisconnect = async () => {
    await mongoose.disconnect();
};