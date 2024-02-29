const User = require("../models").User;
const LikesFiles = require("../models").LikesFiles;
const UploadFiles = require("../models").UploadFiles;
const Notifications = require("../models").Notifications;

const defaultPage = 1;
const defaultLimit = 10;

const NotificationController = {
	getNotifications: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || defaultPage;
			const limit = parseInt(req.query.limit) || defaultLimit;
			const offset = (page - 1) * limit;

			const totalCount = await Notifications.count({ where: { userId: req.userId } });
			const totalPages = Math.ceil(totalCount / limit);

			const notificationList = await Notifications.findAll({
				where: { userId: req.userId },
				limit,
				offset,
			});

			if (notificationList.length > 0) {
				return res.status(200).json({
					message: "Notifications Listed Successfully.",
					data: notificationList,
					pagination: { totalItems: totalCount, totalPages, currentPage: page },
					status: true,
				});
			} else {
				return res.status(404).json({ message: "No notifications found for this user.", data: [], status: false });
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

module.exports = NotificationController;
