import { Types } from "mongoose";

export interface IPost {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}