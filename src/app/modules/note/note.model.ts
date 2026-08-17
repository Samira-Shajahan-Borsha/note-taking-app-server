import { model, Schema } from "mongoose";
import { INote } from "./note.interface";

const noteSchema = new Schema<INote>(
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

noteSchema.index({ user: 1, createdAt: -1 });

export const Note = model<INote>("Note", noteSchema);
