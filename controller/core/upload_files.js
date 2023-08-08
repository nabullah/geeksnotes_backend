const User = require("./user").User;
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { UploadFiles } = require("../../models");

const upload_files = {
	/*. 1. Create an ApI for SignUp Step 1 */
	uploadSingleFile: async (req, res) => {
		try {
			if (req.userId) {
				if (req.file) {
					if (req.body.audienceRolesIds) {
						const file = req.file;
						const uploadFiles = await UploadFiles.create({
							filePath: file.path.split("\\").slice(1).join("/"),
							fileName: file.filename,
							fileType: file.mimetype.split("/")[1],
							audienceRolesIds: JSON.stringify(req.body.audienceRolesIds),
							isPrivate: false,
							topic: req.body.topic,
							subTopic: req.body.subTopic,
							description: req.body.description,
							userId: req.userId,
						});
						if (!uploadFiles) {
							return res.status(500).json({ status: false, message: "Your file could not be uploaded. Please try again." });
						} else {
							return res.status(200).json({ status: true, message: "File uploaded successfully.", data: uploadFiles});
						}
					} else {
						return res.status(200).json({ status: false, message: "User's Role type is required.", data: [] });
					}
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