import z from "zod";

export const createNoteZodSchema = z.object({
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

export const updateNoteZodSchema = z
    .object({
        title: z
            .string()
            .min(1, { message: "Title is required." })
            .max(200, { message: "Title cannot exceed 200 characters." })
            .trim()
            .optional(),
        content: z
            .string()
            .min(1, { message: "Content is required." })
            .trim()
            .optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "At least one field must be provided for update.",
    });
