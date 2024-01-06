const User = require("../../models/").User;
const UserRole = require("../../models/").UserRole;
const fs = require("fs");
const { UploadFiles } = require("../../models");
const CryptoJS = require("crypto-js");

const upload_files = {
	uploadSingleFile: async (req, res) => {
		try {
			if (req.userId) {
				if (req.file) {
					if (req.body.topic && req.body.subTopic && req.body.description) {
						if (req.body.audienceRolesIds) {
							const file = req.file;
							const uploadFiles = await UploadFiles.create({
								filePath: file.path.split("\\").slice(1).join("/"),
								fileName: file.originalname,
								fileType: file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length),
								audienceRolesIds: req.body.audienceRolesIds,
								isPrivate: false,
								topic: req.body.topic,
								subTopic: req.body.subTopic,
								description: req.body.description,
								userId: req.userId,
								tags: req.body.tags,
							});
							if (!uploadFiles) {
								return res.status(500).json({ status: false, message: "Your file could not be uploaded. Please try again." });
							} else {
								const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(uploadFiles), process.env.SECRET_KEY).toString();
								console.log(uploadFiles);
								return res.status(200).json({ status: true, message: "File uploaded successfully.", data: encryptedFiles });
							}
						} else {
							return res.status(401).json({ status: false, message: "User's Role type is required.", data: [] });
						}
					} else return res.status(401).json({ status: false, message: "Topic, Sub-Topic and Summary is required.", data: [] });
				} else {
					return res.status(200).json({ status: false, message: "Please upload a file first.", data: [] });
				}
			} else {
				return res.status(401).json({ status: false, message: "Unauthorized Access! Please login first." });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	getAllNotes: async (req, res) => {
		try {
			const files = await UploadFiles.findAll({
				where: { isPrivate: false },
				include: [
					{
						model: User,
						attributes: ["id", "fullName", "status", "userRoleId", "profession"],
						as: "user",
						include: [
							{
								model: UserRole,
								attributes: ["id", "roleType"],
								as: "role",
							},
						],
					},
				],
			});
			if (!files) {
				return res.status(500).json({ status: false, message: "Could not get the files. Please try again." });
			} else {
				const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(files), process.env.SECRET_KEY).toString();
				return res.status(200).json({ status: true, message: "Files successfully found.", data: encryptedFiles });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	getFilesWithUserId: async (req, res) => {
		try {
			const userId = req.userId;
			const filesList = await UploadFiles.findAll({ where: { userId: userId } });
			if (filesList) {
				const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(filesList), process.env.SECRET_KEY).toString();
				return res.status(200).json({ status: true, message: "Files found successfully.", data: encryptedFiles });
			} else {
				return res.status(200).json({ status: true, message: "Files found successfully.", data: [] });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},
};

module.exports = upload_files;
