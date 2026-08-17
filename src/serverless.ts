import type { Request, Response } from "express";
import app from "./app";
import { connectDB } from "./app/utils/connectDB";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

(async () => {
    try {
        await connectDB();
        await seedSuperAdmin();
    } catch (error) {
        console.error("Serverless init failed:", error);
    }
})();

export default function handler(req: Request, res: Response) {
    app(req, res);
}