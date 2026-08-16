import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";

export const checkAuth =
    (...authRole: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(httpStatusCode.UNAUTHORIZED, "No token received");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN_SECRET);

        const isUserExist = await User.findById(verifiedToken.userId);

        // console.log(isUserExist, "User from middleware");

        if (!isUserExist) {
            throw new AppError(httpStatusCode.NOT_FOUND, "User does not exist");
        }

        if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(
                httpStatusCode.UNAUTHORIZED,
                "You are not permitted to access this route"
            );
        }

        req.user = verifiedToken;

        next();
    };
