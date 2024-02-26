const User = require("../../models/").User;
const UserRole = require("../../models/").UserRole;
const ViewsFiles = require("../../models/").ViewsFiles;
const fs = require("fs");
const { UploadFiles } = require("../../models");
const CryptoJS = require("crypto-js");
const db = require("../../models/index");

const upload_files = {
	uploadSingleFile: async (req, res) => {
		try {
			if (req.userId) {
				if (req.file) {
					if (req.body.topic && req.body.subTopic && req.body.description) {
						if (req.body.audienceRolesIds) {
							const file = req.file;
							// console.log(">>>>>>>>>>" , file)
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
								fileSize: file.size
							});
							if (!uploadFiles) {
								return res.status(500).json({ status: false, message: "Your file could not be uploaded. Please try again." });
							} else {
								const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(uploadFiles), process.env.SECRET_KEY).toString();
								// console.log(uploadFiles);
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

	
};

module.exports = upload_files;
