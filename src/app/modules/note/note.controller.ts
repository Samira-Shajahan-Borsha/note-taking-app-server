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
    getSingleNote,
    deleteNote,
};
