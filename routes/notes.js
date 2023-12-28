const Notes = require("express").Router();
const authCheck = require("../middleware/middleware");
const LikesFiles = require("../models").LikesFiles;
const ViewsFiles = require("../models").ViewsFiles;
const NotesController = require("../controller/notes");


Notes.get("/like", authCheck.jwtToken, NotesController.likeFile);
Notes.get("/view", authCheck.jwtToken, NotesController.viewFile);

// Notes.get("/getAllNotes", UploadFilesController.getAllNotes);

module.exports = Notes;
