import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

// Todo: add auth middleware to protect this route for admin to create user
router.post("/create-user", UserController.createUser);

export const UserRoutes = router;