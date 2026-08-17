import { INote } from "./note.interface";
import { Note } from "./note.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";
import { ROLE } from "../user/user.interface";

const createNote = async (userId: string, payload: Partial<INote>) => {
    const { title, content } = payload;

    const result = await Note.create({
        title,
        content,
        user: userId,
    });

    const note = result.toObject();
    return note;
};

const getSingleNote = async (noteId: string, userId: string, role: string) => {
    const note = await Note.findById(noteId);

    if (!note) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Note doesn't exist");
    }

    if (role !== ROLE.ADMIN && note.user.toString() !== userId) {
        throw new AppError(httpStatusCode.FORBIDDEN, "You are not permitted to view this note");
    }

    return note.toObject();
};

const deleteNote = async (noteId: string, userId: string) => {
    const note = await Note.findById(noteId);

    if (!note) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Note doesn't exist");
    }

    if (note.user.toString() !== userId) {
        throw new AppError(httpStatusCode.FORBIDDEN, "You are not permitted to delete this note");
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Note doesn't exist");
    }

    return null;
};

export const NoteService = {
    createNote,
    getSingleNote,
    deleteNote,
};