import express, { Application, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(httpStatusCode.OK).json({
        message: "Welcome to Secure Note Taking App Server",
        environment: "development",
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString(),
    });
});


export default app;
