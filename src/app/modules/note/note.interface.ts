import { Types } from "mongoose";

export interface INote {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
