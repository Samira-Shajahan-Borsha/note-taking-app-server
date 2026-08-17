import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PostService } from "./post.service";
import httpStatusCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId as string;

    const result = await PostService.createPost(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});

const getPostsByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const query = req.query;

    const result = await PostService.getPostsByUser(userId, query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "User posts retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

export const PostController = {
    createPost,
    getPostsByUser,
};