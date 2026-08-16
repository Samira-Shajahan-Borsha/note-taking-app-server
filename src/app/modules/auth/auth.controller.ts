import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatusCode from "http-status-codes";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    setAuthCookie(res, result);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User logged in successfully",
        data: result,
    });
});

const getAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token received from cookies");
    }

    const tokenInfo = await AuthService.getAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "New Access token generated successfully",
        data: tokenInfo,
    });
});


const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const result = await AuthService.getMe(decodedToken.userId);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User profile info retrieved successfully",
        data: result,
    });
});


const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
});


export const AuthController = {
    registerUser,
    login,
    getAccessToken,
    getMe,
    logout
};
