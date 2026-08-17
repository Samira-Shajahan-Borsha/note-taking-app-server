import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

postSchema.index({ user: 1, createdAt: -1 });

export const Post = model<IPost>("Post", postSchema);