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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await UserService.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "All users retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    const result = await UserService.getSingleUser(userId);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});

const getGroupedByInterests = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUsersGroupedByInterests();

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Users grouped by interests retrieved successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    const result = await UserService.updateUser(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    const result = await UserService.deleteUser(userId);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

export const UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    getGroupedByInterests,
    updateUser,
    deleteUser,
};
