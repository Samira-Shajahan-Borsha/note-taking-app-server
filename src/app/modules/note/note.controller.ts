import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { NoteService } from "./note.service";
import httpStatusCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const createNote = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId as string;

    const result = await NoteService.createNote(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "Note created successfully",
        data: result,
    });
});

const getMyNotes = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId as string;
    const query = req.query;

    const result = await NoteService.getMyNotes(userId, query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "My notes retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getAllNotes = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const result = await NoteService.getAllNotes(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "All notes retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id as string;
    const userId = req.user.userId as string;
    const role = req.user.role as string;

    const result = await NoteService.getSingleNote(noteId, userId, role);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Note retrieved successfully",
        data: result,
    });
});

const updateNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id as string;
    const userId = req.user.userId as string;

    const result = await NoteService.updateNote(noteId, userId, req.body);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Note updated successfully",
        data: result,
    });
});

const deleteNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id as string;
    const userId = req.user.userId as string;

    const result = await NoteService.deleteNote(noteId, userId);

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Note deleted successfully",
        data: result,
    });
});

export const NoteController = {
    createNote,
    getMyNotes,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
};
