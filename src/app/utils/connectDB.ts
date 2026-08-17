import mongoose from "mongoose";
import { envVars } from "../config/env";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = (): Promise<typeof mongoose> => {
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(envVars.DB_URL);
    }

    return connectionPromise;
};