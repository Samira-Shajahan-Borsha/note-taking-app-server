import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { NoteController } from "./note.controller";
import { createNoteZodSchema, updateNoteZodSchema } from "./note.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";

const router = Router();

router.post(
    "/create-note",
    checkAuth(...Object.values(ROLE)),
    validateRequest(createNoteZodSchema),
    NoteController.createNote,
);

router.get("/my-notes", checkAuth(...Object.values(ROLE)), NoteController.getMyNotes);

router.get("/all-notes", checkAuth(ROLE.ADMIN), NoteController.getAllNotes);

router.get("/:id", checkAuth(...Object.values(ROLE)), NoteController.getSingleNote);

router.patch(
    "/:id",
    checkAuth(...Object.values(ROLE)),
    validateRequest(updateNoteZodSchema),
    NoteController.updateNote,
);

router.delete("/:id", checkAuth(...Object.values(ROLE)), NoteController.deleteNote);

export const NoteRoutes = router;
