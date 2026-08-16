import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
    (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedBody = await schema.parseAsync(req.body);
            req.body = parsedBody;
            next();
        } catch (error) {
            next(error);
        }
    };
