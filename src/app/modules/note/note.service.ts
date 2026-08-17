import { INote } from "./note.interface";
import { Note } from "./note.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes";
import { ROLE } from "../user/user.interface";
import { QueryBuilder } from "../../utils/queryBuilder";

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

const getMyNotes = async (userId: string, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        Note.find({ user: userId }),
        query
    );

    const notes = queryBuilder.paginate().sort();

    const [result, meta] = await Promise.all([notes.build(), notes.getMeta()]);

    return { result, meta };
};

const getAllNotes = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Note.find().populate("user", "name email"), query);

    const notes = queryBuilder.paginate().sort();

    const [result, meta] = await Promise.all([notes.build(), notes.getMeta()]);

    return { result, meta };
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

const updateNote = async (noteId: string, userId: string, payload: Partial<INote>) => {
    const { title, content } = payload;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Note doesn't exist");
    }

    if (note.user.toString() !== userId) {
        throw new AppError(httpStatusCode.FORBIDDEN, "You are not permitted to update this note");
    }

    const updatedData: Partial<INote> = { title, content };

    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, {
        new: true,
        runValidators: true,
    });

    if (!updatedNote) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Note doesn't exist");
    }

    return updatedNote.toObject();
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
    getMyNotes,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
};