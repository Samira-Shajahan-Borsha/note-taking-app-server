import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();

router.post(
    "/create-user",
    checkAuth(ROLE.ADMIN),
    validateRequest(createUserZodSchema),
    UserController.createUser,
);

router.get("/:id", checkAuth(ROLE.ADMIN), UserController.getSingleUser);

router.patch(
    "/:id",
    checkAuth(ROLE.ADMIN),
    validateRequest(updateUserZodSchema),
    UserController.updateUser,
);

router.delete("/:id", checkAuth(ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
