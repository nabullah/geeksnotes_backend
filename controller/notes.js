const ViewsFiles = require("../models").ViewsFiles;

const User = require("../models").User;
const LikesFiles = require("../models").LikesFiles;

const UserRole = require("../models/").UserRole;
const UploadFiles = require("../models").UploadFiles;
const CryptoJS = require("crypto-js");
const db = require("../models/index");
const Notes = require("../routes/notes");

const NotesController = {
	likeFile: async (req, res) => {
		try {
			const { fileId, userId } = req.query;
			if (fileId && userId) {
				const isAlreadyLiked = await LikesFiles.findOne({ where: { userId: userId, fileId: fileId } });
				if (isAlreadyLiked) {
					await LikesFiles.destroy({ where: { userId: userId, fileId: fileId } });
					return res.status(200).json({ data: { fileId: fileId }, status: true });
				} else {
					const createRecord = await LikesFiles.create(req.query);
					if (createRecord) return res.status(200).json({ data: { fileId: fileId }, status: true });
					else return res.status(200).json({ message: "Some Error Occured, Please try again", data: [], status: true });
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

	viewFile: async (req, res) => {
		try {
			const { fileId } = req.query;
			if (fileId) {
				const isRecordPresent = await ViewsFiles.findOne({ where: { fileId: fileId } });
				if (isRecordPresent) {
					const isupdated = await ViewsFiles.update({ views: isRecordPresent["views"] + 1 }, { where: { fileId: fileId } });
					if (isupdated) return res.status(200).json({ status: true });
					else return res.status(400).json({ status: false });
				} else {
					const createRecord = await ViewsFiles.create(req.query);
					if (createRecord) return res.status(200).json({ data: { fileId: fileId }, status: true });
					else return res.status(400).json({ message: "Some Error Occured, Please try again", data: [], status: true });
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
								attributes: ["id", "roleType", "color"],
								as: "role",
							},
						],
					},
					{
						model: ViewsFiles,
						attributes: ["fileId", "views"],
						as: "views",
					},
				],
				attributes: {
					include: [
						[
							db.sequelize.literal(`(
								SELECT COUNT(*)
								FROM likes_files AS likes
								WHERE
								likes.fileId = upload_files.id)`),
							"likes",
						],
					],
				},
				order: db.sequelize.literal("id DESC"),
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
			if (userId) {
				const filesList = await UploadFiles.findAll({ where: { userId: userId } });
				if (filesList) {
					const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(filesList), process.env.SECRET_KEY).toString();
					return res.status(200).json({ status: true, message: "Files found successfully.", data: encryptedFiles });
				} else {
					return res.status(404).json({ status: false, message: "Files not found.", data: [] });
				}
			} else {
				return res.status(404).json({ status: false, message: "User not found. Please login with correct user", data: [] });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	getNoteById: async (req, res) => {
		try {
			const { id } = req.query;
			const files = await UploadFiles.findOne({
				where: { id: id },
				include: [
					{
						model: User,
						attributes: ["id", "fullName", "status", "userRoleId", "profession", "color"],
						as: "user",
						include: [
							{
								model: UserRole,
								attributes: ["id", "roleType", "color"],
								as: "role",
							},
						],
					},
					{
						model: ViewsFiles,
						attributes: ["fileId", "views"],
						as: "views",
					},
				],
				attributes: {
					include: [
						[
							db.sequelize.literal(`(
								SELECT COUNT(*)
								FROM likes_files AS likes
								WHERE
								likes.fileId = upload_files.id)`),
							"likes",
						],
					],
				},
				order: [["id", "DESC"]],
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

	deleteNoteById: async (req, res) => {
		try {
			if (req.query.id) {
				const affectedRows = await UploadFiles.destroy({ where: { id: req.query.id } });
				console.log(">>>>.", affectedRows);
				if (affectedRows) {
					const file2 = await UploadFiles.findOne({ where: { id: req.query.id } });
					return res.status(200).json({ status: true, message: "File deleted successfully.", data: file2 });
				} else return res.status(200).json({ status: false, message: "Could not delete the file, Please try again.", data: [] });
			} else {
				return res.status(500).json({ status: true, message: "Some Error Occured.", data: [] });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},
	restoreDeleteNoteById: async (req, res) => {
		try {
			if (req.query.id) {
				const affectedRows = await UploadFiles.restore({ where: { id: req.query.id } });
				console.log(">>>>.", affectedRows);
				if (affectedRows) {
					const file2 = await UploadFiles.findOne({ where: { id: req.query.id } });
					return res.status(200).json({ status: true, message: "File restored successfully.", data: file2 });
				} else return res.status(200).json({ status: false, message: "Could not restore the file, Please try again.", data: [] });
			} else {
				return res.status(500).json({ status: true, message: "Some Error Occured.", data: [] });
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

module.exports = NotesController;
