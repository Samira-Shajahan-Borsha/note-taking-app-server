import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { AuthController } from "./auth.controller";
import { ROLE } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), AuthController.registerUser);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.getAccessToken);
router.post("/logout", AuthController.logout);

router.get("/me", checkAuth(...Object.values(ROLE)), AuthController.getMe);

export const AuthRoutes = router;
