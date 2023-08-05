const userRouter = require("express").Router();
const authCheck = require("../../middleware/middleware");
const user = require("../../controller/core/user");
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

userRouter.post("/registration/1", user.signUpStep1);
userRouter.post("/registration/2", user.signUpStep2);
userRouter.post("/login", user.login);
// userRouter.get("/getUserDetails/:id", authCheck.jwtToken, user.getUserDetails);
// userRouter.post("/editUserInfo", authCheck.jwtToken, upload.single("file"), user.editUserInfo);
// userRouter.post("/adminAddUser", authCheck.jwtToken, upload.single("file"), user.adminAddUser);
// userRouter.get("/adminGetUserList", authCheck.jwtToken, user.adminGetUserList);
// userRouter.get("/adminDeleteUser/:id", authCheck.jwtToken, user.adminDeleteUser);

module.exports = userRouter;
