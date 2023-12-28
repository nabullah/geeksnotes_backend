const { ViewsFiles } = require("../models");

const User = require("../models").User;
const LikesFiles = require("../models").LikesFiles;

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
};

module.exports = NotesController;
