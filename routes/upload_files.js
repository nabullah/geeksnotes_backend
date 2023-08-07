const uploadFiles = require("express").Router();
const authCheck = require("../middleware/middleware");
const multer = require("multer");

// Upload Files
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
	},
});

// Multer Filter
const multerFilter = (req, file, cb) => {
	if (file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png") {
		cb(null, true);
	} else {
		cb(new Error("Invalid FIle!!"), false);
	}
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// uploadFiles.post("/registration/1", user.signUpStep1);

module.exports = uploadFiles;
