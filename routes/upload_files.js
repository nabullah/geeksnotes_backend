const uploadFiles = require("express").Router();
const authCheck = require("../middleware/middleware");
const multer = require("multer");
const UploadFiles = require("../models").UploadFiles;
const UploadFilesController = require("../controller/core/upload_files");

// Upload Files
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/cache-s3/");
	},
	// filename: (req, file, cb) => {
	// 	let ext = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
	// 	cb(null, `notes-${file.fieldname}-${Date.now()}${ext}`);
	// },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
	const allowedFormats = [".pdf", ".docx", ".pptx"];
	let ext = file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length);
	if (allowedFormats.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid FIle!!"), false);
	}
};

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const upload = multer({ storage: multerStorage });
/**
 * @openapi
 * '/api/upload/uploadFilesSingle':
 *  post:
 *     tags:
 *     - Uploads
 *     summary: Upload Single File
 *     security:
 *       - JWT: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *                 required: true
 *               audienceRolesIds:
 *                 type: string
 *                 required: true
 *               topic:
 *                 type: string
 *               subTopic:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 filePath:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 fileType:
 *                   type: string
 *                 audienceRolesIds:
 *                   type: string
 *                 isPrivate:
 *                   type: boolean
 *                 topic:
 *                   type: string
 *                 subTopic:
 *                   type: string
 *                 description:
 *                   type: string
 *                 userId:
 *                   type: number
 */
uploadFiles.post("/uploadFilesSingle", authCheck.jwtToken, upload.single("file"), UploadFilesController.uploadSingleFile);

module.exports = uploadFiles;
