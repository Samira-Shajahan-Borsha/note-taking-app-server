import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import httpStatusCode from "http-status-codes";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);

    res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
});

export const UserController = {
    createUser,
};
