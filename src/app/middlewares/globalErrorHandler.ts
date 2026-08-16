/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { ZodError } from "zod";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

interface IErrorSource {
    path: string;
    message: string;
}

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorSources: IErrorSource[] = [];
    const stack: string | undefined = err instanceof Error ? err.stack : undefined;

    if (err instanceof ZodError) {
        statusCode = httpStatusCode.BAD_REQUEST;
        message = "Validation failed";
        errorSources = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        message = err.message;
    }

    if (envVars.NODE_ENV === "development") console.error("❌ Global Error:", err);

    res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorSources.length ? errorSources : undefined,
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
    });
};
