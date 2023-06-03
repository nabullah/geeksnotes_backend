const userRouter = require("express").Router();
const authCheck = require("../../middleware/middleware");
const user = require("../../controller/core/userController");
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

userRouter.post("/registration", user.signUp);
// userRouter.post("/login", userController.login);
// userRouter.get("/getUserDetails/:id", authCheck.jwtToken, userController.getUserDetails);
// userRouter.post("/editUserInfo", authCheck.jwtToken, upload.single("file"), userController.editUserInfo);
// userRouter.post("/adminAddUser", authCheck.jwtToken, upload.single("file"), userController.adminAddUser);
// userRouter.get("/adminGetUserList", authCheck.jwtToken, userController.adminGetUserList);
// userRouter.get("/adminDeleteUser/:id", authCheck.jwtToken, userController.adminDeleteUser);

module.exports = userRouter;
