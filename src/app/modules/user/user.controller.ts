import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import httpStatusCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "User created successfully",
        data: result,
    });
});

export const UserController = {
    createUser,
};
