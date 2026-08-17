import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PostController } from "./post.controller";
import { createPostZodSchema } from "./post.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";

const router = Router();

router.post(
    "/create-post",
    checkAuth(...Object.values(ROLE)),
    validateRequest(createPostZodSchema),
    PostController.createPost,
);

router.get("/user/:userId", checkAuth(...Object.values(ROLE)), PostController.getPostsByUser);

export const PostRoutes = router;