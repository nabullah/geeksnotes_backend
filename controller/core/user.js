const User = require("../../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "6hEVETCGQJ5xmVMA235467uyjhtrety5yrt$tgw54teg#$%##%g#$#$6e9GasasdasdXjeWDEE5AHiaOaXXFcVNiC548=34rgsfdfwer23rwfasdA@#$%gfsdf#%$t%trfsdda";
const db = require("../../models/index");
const randomColors = require("../../util/functions");
// const File = require("../../models").File;
// const fs = require("fs");

const user_controller = {
	/*. 1. Create an ApI for SignUp */
	signUp: async (req, res) => {
		try {
			let result = await User.findOne({
				where: { email: req.body.email },
			});
			if (result) {
				return res.send({ code: 409, message: "Email Already Exist.", result: [] });
			} else {
				let password = req.body.password;
				req.body.password = bcrypt.hashSync(password);
				let userSave = await User.create(req.body);
				if (!userSave) {
					return res.send({ code: 500, message: "Internal Server Error.", result: [] });
				} else {
					let userResult = await User.findOne({ where: { email: req.body.email } });
					return res.send({
						code: 200,
						status: true,
						message: "Hooray! Your registration is complete, and you're officially a part of our community.",
						data: {
							id: userResult.id,
							fullName: userResult.fullName,
							email: userResult.email,
							address: userResult.address,
							mobile: userResult.mobile,
							status: userResult.status,
							userRole: userResult.user_role,
							color: userResult.color,
							academicsDetailId: userResult.academicsDetailId,
							profession: userResult.profession,
							dob: userResult.dob,
							createdAt: userResult.createdAt,
							updatedAt: userResult.updatedAt,
						},
					});
				}
			}
		} catch (error) {
			return res.send({
				code: 501,
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	/*. 1. Create an ApI for SignUp */
	login: async (req, res) => {
		try {
			let userResult = await User.findOne({
				where: { email: req.body.email },
				// include: [
				// 	{
				// 		model: File,
				// 		attributes: ["files_link"],
				// 		as: "profilePhoto",
				// 	},
				// ],
			});
			if (!userResult) {
				return res.send({ code: 404, message: "User Not Found. Please check Email and Password", data: [], status: false });
			} else if (req.body.email && req.body.password) {
				if (req.body.email != userResult.email) {
					return res.send({ code: 401, message: "Please check your Email.", status: false });
				} else {
					let passCheck = bcrypt.compareSync(req.body.password, userResult.password);
					if (passCheck == false) {
						return res.send({ code: 401, message: "Please check your password.", status: false });
					} else {
						/* API for User Authentication*/

						let data = {
							id: userResult.id,
							first_name: userResult.first_name,
							last_name: userResult.last_name,
							email: userResult.email,
							address: userResult.address,
							mobile_number: userResult.mobile_number,
							status: userResult.status,
							user_role: userResult.user_role,
							createdAt: userResult.createdAt,
							updatedAt: userResult.updatedAt,
							color: userResult.color,
							// profilePhoto: userResult.profilePhoto,
						};
						let token = jwt.sign(data, SECRET_KEY, { expiresIn: "24h" });
						const expirationTime = new Date(jwt.decode(token).exp * 1000);
						data.expireIn = expirationTime;
						return res.send({ code: 200, message: "You have successfully logged in to your account.", data: { token: token, user: data }, status: true });
					}
				}
			} else {
				return res.send({ code: 401, message: "Please check your email and password.", status: false });
			}
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Get User Details */
	getUserDetails: async (req, res) => {
		try {
			const user = await User.findOne({
				attributes: [`first_name`, `last_name`, `email`, `address`, `mobile_number`, `status`, `user_role`, `color`, `createdAt`, `updatedAt`],
				where: {
					id: req.params.id,
				},
				include: [
					{
						model: File,
						attributes: ["files_link"],
						as: "profilePhoto",
					},
				],
			});
			if (user) {
				return res.send({
					code: 200,
					message: "User Successfully Found.",
					data: user,
					status: true,
				});
			} else {
				return res.send({ code: 401, message: "User Not Found.", data: [], status: false });
			}
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Edit User Details */

	editUserInfo: async (req, res) => {
		try {
			if (req.body) {
				const checkFile = await File.findOne({ where: { user_id: req.body.id } });
				if (checkFile) {
					await File.update({ files_link: req.file.filename }, { where: { user_id: req.body.id } });
				} else {
					await File.create({ files_link: req.file.filename, user_id: req.body.id });
				}
				const user = await User.update(
					{ first_name: req.body.first_name, last_name: req.body.last_name, address: req.body.address, mobile_number: req.body.mobile_number, color: req.body.color },
					{ where: { id: req.body.id } }
				).then((data) => {
					if (data) {
						return res.send({ code: 200, message: "Record updated successfully.", status: true });
					} else {
						return res.send({ code: 401, message: "Record not updated. Please try again", status: false });
					}
				});
			} else {
				return res.send({ code: 401, message: "Something Wrong. Please check ", status: false });
			}
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Add New User From Admin Panel */

	adminAddUser: async (req, res) => {
		try {
			const user = await User.findOne({ where: { email: req.body.email } });
			if (user) {
				return res.send({ message: "User already Exits.", data: [], status: false });
			} else {
				let password = req.body.password;
				req.body.password = bcrypt.hashSync(password);
				let userSave = await User.create(req.body);
				if (userSave) {
					if (req.file) {
						await File.create({ files_link: req.file.filename, user_id: userSave.id });
					}

					if (!req.body.color) {
						await User.update(randomColors.randomColors(), { where: { email: req.body.email } });
					}
				}
				if (!userSave) {
					return res.send({ code: 500, message: "Internal Server Error.", status: false, result: [] });
				} else {
					return res.send({ code: 200, status: true, data: userSave, message: "Congratulations! Your account has been successfully created." });
				}
			}
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Get all user details From Admin Panel */

	adminGetUserList: async (req, res) => {
		try {
			// const user = await db.sequelize.query(
			//   "SELECT `id`, `first_name`, `last_name`, `email`, `address`, `mobile_number`, `status`, `user_role`, `color`, `createdAt`, `updatedAt` FROM `users` WHERE `user_role`='user'",
			//   {
			//     type: QueryTypes.SELECT,
			//     include: [
			//       {
			//         model: File,
			//         attributes: ["files_link"],
			//         as: "profilePhoto",
			//       },
			//     ],
			//   }
			// );
			const user = await User.findAll({
				attributes: [`id`, `first_name`, `last_name`, `email`, `address`, `mobile_number`, `status`, `user_role`, `color`, `createdAt`, `updatedAt`],
				where: {
					user_role: "user",
				},
				include: [
					{
						model: File,
						attributes: ["files_link"],
						as: "profilePhoto",
					},
				],
			});
			if (user) {
				return res.send({ code: 200, status: true, data: user, message: "User List found Successfully" });
			} else {
				return res.send({ message: "No Active User.", status: false, result: [] });
			}
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	adminDeleteUser: async (req, res) => {
		try {
			let FileToDelete = await File.findOne({ where: { user_id: req.params.id } });
			let user = await User.destroy({ where: { id: req.params.id } });
			let file = await File.destroy({ where: { user_id: req.params.id } });
			fs.unlink("./public/" + FileToDelete.files_link, (err) => {
				if (err) {
					throw err;
				}
				if (user) {
					return res.send({ code: 200, status: true, message: "User Successfully Removed" });
				} else {
					return res.send({ message: "User not found.", status: false, result: [] });
				}
			});
		} catch (error) {
			return res.send({
				code: 500,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},
};

module.exports = user_controller;
