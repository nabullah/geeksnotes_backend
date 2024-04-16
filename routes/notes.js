const Notes = require("express").Router();
const authCheck = require("../middleware/middleware");
const LikesFiles = require("../models").LikesFiles;
const ViewsFiles = require("../models").ViewsFiles;
const NotesController = require("../controller/notes");

Notes.get("/like", authCheck.jwtToken, NotesController.likeFile);
Notes.get("/view", authCheck.jwtToken, NotesController.viewFile);
Notes.get("/like/isAlreadyLiked", authCheck.jwtToken, NotesController.checkIfAlreadyLiked);

/**
 * @openapi
 * '/api/notes/getAllNotes':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Get the list of all notes
 *     content:
 *       schema:
 *         type: object
 *         properties:
 *           token:
 *             type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/getAllNotes", NotesController.getAllNotes);

/**
 * @openapi
 * '/api/notes/getFilesWithUserId':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Get the list of all uploaded files a loggedin user.
 *     content:
 *       schema:
 *         type: object
 *         properties:
 *           token:
 *             type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/getFilesWithUserId", authCheck.jwtToken, NotesController.getFilesWithUserId);

/**
 * @openapi
 * '/api/notes/getNoteById':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Get Notes details.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/getNoteById", NotesController.getNoteById);

/**
 * @openapi
 * '/api/notes/deleteNoteById':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Soft delete notes.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/deleteNoteById", NotesController.deleteNoteById);

/**
 * @openapi
 * '/api/notes/restoreDeleteNoteById':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Restore Soft deleted notes.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/restoreDeleteNoteById", NotesController.restoreDeleteNoteById);

/**
 * @openapi
 * '/api/notes/getLibraryNotes':
 *  get:
 *     tags:
 *     - Notes
 *     summary: Get the list of all notes that user has liked
 *     content:
 *       schema:
 *         type: object
 *         properties:
 *           token:
 *             type: string
 *     responses:
 *       200:
 *         description: Success
 */
Notes.get("/getLibraryNotes", authCheck.jwtToken, NotesController.getLibraryNotes);

module.exports = Notes;
