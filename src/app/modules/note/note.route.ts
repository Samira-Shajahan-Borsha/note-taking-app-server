import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { NoteController } from "./note.controller";
import { createNoteZodSchema } from "./note.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";

const router = Router();

router.post(
    "/create-note",
    checkAuth(...Object.values(ROLE)),
    validateRequest(createNoteZodSchema),
    NoteController.createNote,
);

router.get("/:id", checkAuth(...Object.values(ROLE)), NoteController.getSingleNote);

router.delete("/:id", checkAuth(...Object.values(ROLE)), NoteController.deleteNote);

export const NoteRoutes = router;
