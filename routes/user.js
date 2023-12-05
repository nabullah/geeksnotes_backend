const userRouter = require("express").Router();
const authCheck = require("../middleware/middleware");
const user = require("../controller/core/user");
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

/**
 * @openapi
 * '/api/user/registration/1':
 *  post:
 *     tags:
 *     - Registration
 *     summary: Registration Step 1
 *     requestBody:
 *       content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              fullName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              profession:
 *                type: string
 *              dob:
 *                type: string
 *              userRoleId:
 *                type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                fullName:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                profession:
 *                  type: string
 *                dob:
 *                  type: string
 *                userRoleId:
 *                  type: number
 */
userRouter.post("/registration/1", user.signUpStep1);

/**
 * @openapi
 * '/api/user/registration/2':
 *  post:
 *     tags:
 *     - Registration
 *     summary: Registration Step 2
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 required: true
 *               institute:
 *                 type: string
 *                 required: true
 *               place:
 *                 type: string
 *                 required: true
 *               graduationDate:
 *                 type: string
 *                 required: true
 *               graduationYear:
 *                 type: string
 *                 required: true
 *               qualificationsSummary:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: number
 *                 institute:
 *                   type: string
 *                 place:
 *                   type: string
 *                 graduationDate:
 *                   type: string
 *                 graduationYear:
 *                   type: string
 *                 qualificationsSummary:
 *                   type: string
 */
userRouter.post("/registration/2", user.signUpStep2);

/**
 * @openapi
 * '/api/user/login':
 *  post:
 *     tags:
 *     - Login
 *     summary: Login API
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   required: true
 *                 password:
 *                   type: string
 *                   required: true
 */

userRouter.post("/login", user.login);

/**
 * @openapi
 * '/api/user/adminGetUserList':
 *  get:
 *     tags:
 *     - Admin
 *     summary: Get the list of all the users
 *     security:
 *       - JWT: []
 *     content:
 *       schema:
 *         type: object
 *         properties:
 *           token:
 *             type: string
 *             required: true
 *     responses:
 *       200:
 *         description: Success
 */
userRouter.get("/adminGetUserList", authCheck.jwtToken, user.adminGetUserList);

/**
 * @openapi
 * '/api/user/getAllUserRoles':
 *  get:
 *     tags:
 *     - Users
 *     summary: Get the list of all types of user roles
 *     security:
 *       - JWT: []
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
userRouter.get("/getAllUserRoles", user.getAllUserRoles);

module.exports = userRouter;
