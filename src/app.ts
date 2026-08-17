import express, { Application, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { envVars } from "./app/config/env";
import { connectDB } from "./app/utils/connectDB";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
    cors({
        origin: envVars.FRONTEND_URL,
        credentials: true,
    })
);

app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(httpStatusCode.OK).json({
        message: "Welcome to Secure Note Taking App Server",
        environment: "development",
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString(),
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
