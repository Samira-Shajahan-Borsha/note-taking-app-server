import z from "zod";

export const createPostZodSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required." })
        .max(200, { message: "Title cannot exceed 200 characters." })
        .trim(),
    content: z
        .string()
        .min(1, { message: "Content is required." })
        .trim(),
});