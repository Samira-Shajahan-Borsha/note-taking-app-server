import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();

router.post(
    "/create-user",
    checkAuth(ROLE.ADMIN),
    validateRequest(createUserZodSchema),
    UserController.createUser,
);

export const UserRoutes = router;
