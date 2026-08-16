import z from "zod";
import { ROLE } from "./user.interface";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .trim(),
    email: z
        .email({ pattern: emailRegex, message: "Please provide a valid email address." })
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/\d/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`]/, {
            message: "Password must contain at least one special character.",
        }),
    role: z.enum([ROLE.USER, ROLE.ADMIN]).optional().default(ROLE.USER),
    interests: z
        .array(z.string().trim().min(1, "Interest cannot be empty."))
        .optional()
        .default([]),
});