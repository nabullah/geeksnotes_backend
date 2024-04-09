const fs = require("fs");
const { UploadFiles, Notifications, FilesThumbnails } = require("../../models");
const CryptoJS = require("crypto-js");
const db = require("../../models/index");
const uploadToServer = require("../../util/clever-cloud-s3");
const SEND_NOTIFICATION = require("../../firebase/notifications/firebase-notification");
const NOTIFICATION_TYPE = require("../../firebase/notifications/notificationTypes");
const pdfConverter = require("../../util/convert_to_img");

const upload_files = {
	uploadSingleFile: async (req, res) => {
		try {
			if (req.userId) {
				if (req.file) {
					if (req.body.topic && req.body.subTopic && req.body.description) {
						if (req.body.audienceRolesIds) {
							const data = await uploadToServer.uploadFile(req.file);
							const thumbnailLink = await pdfConverter.toJPEG(data);
							if (data) {
								const filesUploaded = await UploadFiles.create({
									filePath: data,
									fileName: req.file.originalname,
									fileType: req.file.originalname.substring(req.file.originalname.lastIndexOf("."), req.file.originalname.length),
									audienceRolesIds: req.body.audienceRolesIds,
									isPrivate: false,
									topic: req.body.topic,
									subTopic: req.body.subTopic,
									description: req.body.description,
									userId: req.userId,
									tags: req.body.tags,
									fileSize: req.file.size,
								});

								if (!filesUploaded) {
									return res.status(500).json({ status: false, message: "Your file could not be uploaded. Please try again." });
								} else {

									let saveThumbnail = null;
									if (thumbnailLink) {
										saveThumbnail = await FilesThumbnails.create({ thumbnailPath: thumbnailLink, fileId: filesUploaded.id });
									}
									Notifications.create({
										fileId: filesUploaded.id,
										userId: req.userId,
										isRead: false,
										fromUserId: req.userId,
										type: "uploadFile",
										notificationDescription: "Your file has been successfully published.",
										notificationType: "Upload File",
									});
									const notificationsDetails = { fileName: filesUploaded.fileName };

									SEND_NOTIFICATION.sendNotification(req.userId, notificationsDetails, NOTIFICATION_TYPE.FILE_UPLOAD);
									const data = { ...filesUploaded.dataValues, thumbnail: saveThumbnail };
									const encryptedFiles = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
									return res.status(200).json({ status: true, message: "File uploaded successfully.", data: data });
								}
							} else {
								return res.status(500).json({ status: false, message: "Your file could not be uploaded. Please try again.", data: [] });
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
