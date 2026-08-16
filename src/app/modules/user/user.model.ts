import { model, Schema } from "mongoose";
import { IUser, ROLE } from "./user.interface";

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [2, "Name must contain at least 2 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must contain at least 8 characters"],
            trim: true
        },
        role: {
            type: String,
            enum: {
                values: Object.values(ROLE),
                message: "{VALUE} is not supported as role",
            },
            default: ROLE.USER,
            required: true,
        },
        interests: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ interests: 1 });

userSchema.index({ createdAt: -1 });

export const User = model<IUser>("User", userSchema);
