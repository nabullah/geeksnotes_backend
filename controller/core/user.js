const User = require("../../models").User;
const AcademicDetails = require("../../models").AcademicDetails;
const UserRole = require("../../models").UserRole;
const OTP = require("../../models").OTP;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../models/index");
const randomColors = require("../../util/functions");
const otpGenerator = require("../../util/OTP");
const sendOTPEmail = require("../../util/email");
// const File = require("../../models").File;
// const fs = require("fs");
const emailValidator = require("deep-email-validator");
const functions = require("../../util/functions");
const email = require("../../util/email");

const user_controller = {
	/*. 1. Create an ApI for SignUp Step 1 */
	signUpStep1: async (req, res) => {
		try {
			let result = await User.findOne({
				where: { email: req.body.email },
			});
			if (result) {
				return res.status(200).json({ message: "Email Already Exist.", result: [] });
			} else if (req.body.password && req.body.email) {
				let password = req.body.password;
				req.body.password = bcrypt.hashSync(password);
				req.body.permission = "user";
				let userSave = await User.create(req.body);
				if (!userSave) {
					return res.status(500).json({ message: "Internal Server Error.", result: [] });
				} else {
					let userResult = await User.findOne({ where: { email: req.body.email } });
					const OTP = await otpGenerator.sendOTP(userResult.id);
					await sendOTPEmail.sendOTPEmail({
						email: userResult.email,
						otp: OTP["dataValues"]["otp"],
						name: userResult.fullName,
					});
					return res.status(200).json({
						status: true,
						message: "Step 1 of registration is completed successfully.",
						data: { id: userResult.id },
					});
				}
			} else {
				return res.status(200).json({ status: false, message: "Email or password missing. Please insert email and password", data: [] });
			}
		} catch (error) {
			return res.status(400).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	signUpStep2: async (req, res) => {
		try {
			let user = await User.findOne({
				where: { id: req.body.userId },
			});
			let checkIfAlreadyRegistered = await AcademicDetails.findOne({
				where: { userId: req.body.userId },
			});
			if (checkIfAlreadyRegistered) {
				return res.status(200).json({ message: "User already registered.", result: [] });
			} else {
				if (user) {
					let saveQualifications = await AcademicDetails.create(req.body);
					if (saveQualifications) {
						let getQualifications = await AcademicDetails.findOne({ where: { userId: req.body.userId } });
						await User.update({ academicsDetailId: getQualifications.id, status: "active", color: randomColors.randomColors() }, { where: { id: req.body.userId } }).then(async (data) => {
							if (data) {
								const isVerified = await OTP.findOne({ where: { userId: req.body.userId } });
								console.log(">>>>>>>>>", isVerified);
								if (isVerified.verified) {
									await User.update({ isVerified: true }, { where: { id: req.body.userId } });
									let user = await User.findOne({
										where: { id: req.body.userId },
										attributes: ["id", "fullName", "email", "isVerified", "address", "mobile", "dob", "status", "userRoleId", "color", "academicsDetailId", "profession"],
										include: [
											{
												model: AcademicDetails,
												attributes: ["id", "userId", "qualificationsSummary", "institute", "place", "graduationDate", "graduationYear"],
												as: "academicDetails",
											},
											{
												model: UserRole,
												attributes: ["id", "roleType"],
												as: "role",
											},
										],
									});
									return res.status(200).json({ data: user, status: true, message: "Hooray! Your registration is complete, and you're officially a part of our community." });
								} else {
									return res.status(401).json({ data: [], status: false, isVerified: false, message: "User is not verified. Please verify your account." });
								}
							} else {
								return res.status(500).json({ message: "Some error occured", status: false });
							}
						});
					} else {
						return res.status(200).json({ message: "User not found", status: false });
					}
				} else {
					return res.status(200).json({ message: "Some error in saving Qualifications", status: false });
				}
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	/*. 1. Creating an ApI for Login */
	login: async (req, res) => {
		try {
			let userResult = await User.findOne({
				where: { email: req.body.email },
				include: [
					{
						model: AcademicDetails,
						attributes: ["id", "userId", "qualificationsSummary", "institute", "place", "graduationDate", "graduationYear"],
						as: "academicDetails",
					},
					{
						model: UserRole,
						as: "role",
					},
				],
				// include: [
				// 	{
				// 		model: File,
				// 		attributes: ["files_link"],
				// 		as: "profilePhoto",
				// 	},
				// ],
			});
			if (!userResult) {
				return res.status(200).json({ message: "User Not Found. Please check Email and Password", data: [], status: false });
			} else if (req.body.email && req.body.password) {
				if (req.body.email != userResult.email) {
					return res.status(200).json({ message: "Please check your Email.", status: false });
				} else {
					let passCheck = bcrypt.compareSync(req.body.password, userResult.password);
					if (passCheck == false) {
						return res.status(200).json({ message: "Please check your password.", status: false });
					} else {
						/* API for User Authentication*/
						await User.update({ fcmToken: req.body.fcmToken }, { where: { id: userResult.id } });
						userResult.password = undefined;
						data = userResult;
						let token = jwt.sign(data.toJSON(), process.env.SECRET_KEY, { expiresIn: "24h" });
						const expirationTime = new Date(jwt.decode(token).exp * 1000);
						return res.status(200).json({ message: "You have successfully logged in to your account.", data: { token: token, user: data, expireIn: expirationTime }, status: true });
					}
				}
			} else {
				return res.status(200).json({ message: "Please check your email and password.", status: false });
			}
		} catch (error) {
			return res.status(500).json({
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
				// include: [
				// 	{
				// 		model: File,
				// 		attributes: ["files_link"],
				// 		as: "profilePhoto",
				// 	},
				// ],
			});
			if (user) {
				return res.status(200).json({
					message: "User Successfully Found.",
					data: user,
					status: true,
				});
			} else {
				return res.status(200).json({ message: "User Not Found.", data: [], status: false });
			}
		} catch (error) {
			return res.status(500).json({
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
						return res.status(200).json({ message: "Record updated successfully.", status: true });
					} else {
						return res.status(500).json({ message: "Record not updated. Please try again", status: false, result: data });
					}
				});
			} else {
				return res.status(500).json({ message: "Something Wrong. Please check ", status: false });
			}
		} catch (error) {
			return res.status(500).json({
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
				return res.status(200).json({ message: "User already Exits.", data: [], status: false });
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
					return res.status(500).json({ message: "Internal Server Error.", status: false, result: [] });
				} else {
					return res.status(200).json({ status: true, data: userSave, message: "Congratulations! Your account has been successfully created." });
				}
			}
		} catch (error) {
			return res.status(500).json({
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Get all user details From Admin Panel */

	adminGetUserList: async (req, res) => {
		// try {
		// 	if (req.permission == "admin") {
		// 		const user = await User.findAll({
		// 			attributes: ["id", "fullName", "email", "address", "mobile", "dob", "status", "userRoleId", "color", "academicsDetailId", "profession"],
		// 			include: [
		// 				{
		// 					model: AcademicDetails,
		// 					attributes: ["id", "userId", "qualificationsSummary", "institute", "place", "graduationDate", "graduationYear"],
		// 					as: "academicDetails",
		// 				},
		// 				{
		// 					model: UserRole,
		// 					as: "role",
		// 				},
		// 			],
		// 		});
		// 		if (user) {
		// 			return res.status(200).json({ status: true, data: user, message: "User List found Successfully" });
		// 		} else {
		// 			return res.status(200).json({ message: "No Active User.", status: false, data: [] });
		// 		}
		// 	} else {
		// 		return res.status(403).json({ message: "Access Forbidden. You don't have the necessary permissions to perform this action." });
		// 	}
		// } catch (error) {
		// 	return res.status(500).json({
		// 		message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
		// 		result: error.message,
		// 		status: false,
		// 	});
		// }

		try {
			const user = await User.findAll({
				attributes: ["id", "fullName", "email", "address", "mobile", "dob", "permission", "status", "userRoleId", "color", "academicsDetailId", "profession"],
				include: [
					{
						model: AcademicDetails,
						attributes: ["id", "userId", "qualificationsSummary", "institute", "place", "graduationDate", "graduationYear"],
						as: "academicDetails",
					},
					{
						model: UserRole,
						as: "role",
					},
				],
			});
			if (user) {
				return res.status(200).json({ status: true, data: user, message: "User List found Successfully" });
			} else {
				return res.status(200).json({ message: "No Active User.", status: false, data: [] });
			}
		} catch (error) {
			return res.status(500).json({
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
					return res.status(200).json({ status: true, message: "User Successfully Removed" });
				} else {
					return res.status(500).json({ message: "User not found.", status: false, result: [] });
				}
			});
		} catch (error) {
			return res.status(500).json({
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Get all user roles */

	getAllUserRoles: async (req, res) => {
		try {
			const userRoles = await UserRole.findAll();
			if (!userRoles) return res.status(404).json({ message: "No User Roles Found", status: false, result: [] });
			return res.status(200).json({ status: true, data: userRoles, message: "User Roles List found Successfully" });
		} catch (error) {
			return res.status(500).json({
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	/**Validate Email Id */

	validateEmail: async (req, res) => {
		try {
			const email = req.query.email;
			if (email) {
				const user = await User.findOne({ where: { email: email } });
				if (!user) {
					const isValid = await emailValidator.validate(email);
					if (!isValid.valid) return res.status(400).json({ status: false, message: "Email is invalid. Please use genuine email address." });
					else return res.status(200).json({ status: true, message: "Email is available." });
				} else return res.status(400).json({ status: false, message: "Email address is already in use." });
			} else return res.status(404).json({ status: false, data: [], message: "Email Id is required." });
		} catch (error) {
			return res.status(500).json({
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},

	resetPassword: async (req, res) => {
		try {
			if (req.query.email) {
				const user = await User.findOne({ where: { email: req.query.email } });
				if (!user) {
					return res.status(400).json({ status: false, message: "User not found." });
				} else {
					const password = await functions.generatePassword(11);
					console.log(password);
					const encodedPassword = bcrypt.hashSync(password);
					const isUpdated = await User.update({ password: encodedPassword }, { where: { email: req.query.email } });
					if (isUpdated) {
						await email.sendResetPasswordEmail({ email: req.query.email, name: user.fullName, password: password });
						return res.status(200).json({ status: true, message: "Temporary password sent to your email address." });
					} else return res.status(400).json({ status: false, message: "Something went wrong. Please try again later." });
				}
			} else return res.status(400).json({ status: false, message: "Email is required." });
		} catch (error) {
			return res.status(500).json({
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.!",
				result: error.message,
				status: false,
			});
		}
	},
};

module.exports = user_controller;
