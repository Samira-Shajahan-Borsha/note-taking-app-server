import { IPost } from "./post.interface";
import { Post } from "./post.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";
import { Types } from "mongoose";

const createPost = async (userId: string, payload: Partial<IPost>) => {
    const { title, content } = payload;

    const result = await Post.create({
        title,
        content,
        user: userId,
    });

    const post = result.toObject();
    return post;
};

const getPostsByUser = async (userId: string, query: Record<string, string>) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Invalid user id");
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const aggregation = await Post.aggregate([
        {
            $match: {
                user: new Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $project: {
                title: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                user: {
                    _id: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $facet: {
                result: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: "total" }],
            },
        },
    ]);

    const result = aggregation[0]?.result ?? [];
    const total = aggregation[0]?.totalCount[0]?.total ?? 0;

    return {
        result,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};

export const PostService = {
    createPost,
    getPostsByUser,
};
