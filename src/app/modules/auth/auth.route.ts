import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), AuthController.registerUser);

export const AuthRoutes = router;
