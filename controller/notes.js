const { ViewsFiles, User, LikesFiles, UserRole, UploadFiles, FilesThumbnails, Ratings } = require("../models");

const CryptoJS = require("crypto-js");
const db = require("../models/index");
const Notes = require("../routes/notes");

const defaultPage = 1;
const defaultLimit = 10;

const NotesController = {
	likeFile: async (req, res) => {
		try {
			const { fileId, userId } = req.query;
			if (fileId && userId) {
				const isAlreadyLiked = await LikesFiles.findOne({ where: { userId: userId, fileId: fileId } });
				if (isAlreadyLiked) {
					await LikesFiles.destroy({ where: { userId: userId, fileId: fileId } });
					return res.status(200).json({ data: { fileId: fileId, liked: false }, status: true });
				} else {
					const createRecord = await LikesFiles.create(req.query);
					if (createRecord) return res.status(200).json({ data: { fileId: fileId, liked: true }, status: true });
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

	checkIfAlreadyLiked: async (req, res) => {
		try {
			const { fileId, userId } = req.query;
			if (fileId && userId) {
				const isAlreadyLiked = await LikesFiles.findOne({ where: { userId: userId, fileId: fileId } });
				return res.status(200).json({ data: { fileId: fileId, liked: isAlreadyLiked ? true : false }, status: true });
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
					// {
					// 	model: User,
					// 	attributes: ["id", "fullName", "status", "userRoleId", "profession"],
					// 	as: "user",
					// 	include: [
					// 		{
					// 			model: UserRole,
					// 			attributes: ["id", "roleType", "color"],
					// 			as: "role",
					// 		},
					// 	],
					// },
					// {
					// 	model: ViewsFiles,
					// 	attributes: ["fileId", "views"],
					// 	as: "views",
					// },
					{
						model: FilesThumbnails,
						attributes: ["id", "thumbnailPath", "fileId"],
						as: "thumbnails",
					},
				],
				// attributes: {
				// 	include: [
				// 		[
				// 			db.sequelize.literal(`(
				// 				SELECT COUNT(*)
				// 				FROM likes_files AS likes
				// 				WHERE
				// 				likes.fileId = upload_files.id)`),
				// 			"likes",
				// 		],
				// 	],
				// },
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
				const page = parseInt(req.query.page) || defaultPage;
				const limit = parseInt(req.query.limit) || defaultLimit;
				const offset = (page - 1) * limit;

				const totalCount = await UploadFiles.count({ where: { userId: req.userId } });
				const totalPages = Math.ceil(totalCount / limit);

				const fileList = await UploadFiles.findAll({ where: { userId: userId }, limit, offset, order: [["createdAt", "DESC"]] });
				const data = {
					fileList,
					pagination: { totalItems: totalCount, totalPages, currentPage: page },
				};
				if (fileList) {
					const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
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
			const totalRatings = await Ratings.count({ where: { fileId: id } });
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
					{
						model: FilesThumbnails,
						attributes: ["id", "thumbnailPath", "fileId"],
						as: "thumbnails",
					},
				],
				attributes: {
					include: [
						[
							db.sequelize.literal(`(
								SELECT COUNT(*) FROM likes_files AS likes WHERE likes.fileId = upload_files.id)`), "likes",
						],
						[
							db.sequelize.literal(`(
								SELECT ROUND(AVG(rating), 1) FROM ratings AS rating WHERE rating.fileId = upload_files.id)`), "averageRating",
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

	/** Soft Delete Note */
	deleteNoteById: async (req, res) => {
		try {
			if (req.query.id) {
				const affectedRows = await UploadFiles.destroy({ where: { id: req.query.id } });
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

	/** Restore soft deleted Files */
	restoreDeleteNoteById: async (req, res) => {
		try {
			if (req.query.id) {
				const affectedRows = await UploadFiles.restore({ where: { id: req.query.id } });
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

	getLibraryNotes: async (req, res) => {
		try {
			const userId = req.userId;
			if (userId) {
				const page = parseInt(req.query.page) || defaultPage;
				const limit = parseInt(req.query.limit) || defaultLimit;
				const offset = (page - 1) * limit;

				const getLikedFiles = await db.sequelize.query(
					`SELECT upload_files.*, JSON_OBJECT('id', files_thumbnails.id, 'thumbnailPath', files_thumbnails.thumbnailPath, 'fileId', files_thumbnails.fileId) AS thumbnails 
					 FROM upload_files 
					 LEFT JOIN files_thumbnails ON upload_files.id = files_thumbnails.fileId
					 WHERE upload_files.id IN (SELECT fileId FROM likes_files WHERE userId = ${userId})
					 LIMIT ${limit} OFFSET ${offset}`,
					{
						type: db.sequelize.QueryTypes.SELECT,
					}
				);

				const countQuery = await db.sequelize.query(`SELECT COUNT(*) AS totalCount FROM upload_files WHERE id IN (SELECT fileId FROM likes_files WHERE userId = ${userId})`, {
					type: db.sequelize.QueryTypes.SELECT,
				});

				const totalCount = countQuery[0].totalCount;
				const totalPages = Math.ceil(totalCount / limit);

				const data = {
					getLikedFiles,
					pagination: { totalItems: totalCount, totalPages, currentPage: page },
				};
				if (getLikedFiles) {
					const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
					return res.status(200).json({ status: true, message: "Files found successfully.", data: data });
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

	searchNote: async (req, res) => {

	}
};

module.exports = NotesController;
