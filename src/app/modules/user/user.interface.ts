import { Types } from "mongoose";

export enum ROLE {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    readonly email: string;
    password: string;
    role: ROLE;
    interests?: string[];
    createdAt: Date;
    updatedAt: Date;
}
