
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
				order: [["createdAt", "DESC"]],
			});

			const data = {
				notificationList,
				pagination: { totalItems: totalCount, totalPages, currentPage: page },
			};

			if (notificationList.length > 0) {
				return res.status(200).json({
					message: "Notifications Listed Successfully.",
					data: data,
					status: true,
				});
			} else {
				return res.status(200).json({ message: "No notifications found for this user.", data: [], status: false });
			}
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	getNotificationCount: async (req, res) => {
		try {
			const totalCount = await Notifications.count({ where: { userId: req.userId, isRead: false } });
			if (totalCount) return res.status(200).json(totalCount);
			else return res.status(200).json(0);
		} catch (error) {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	markNotificationRead: async (req, res) => {
		try {
			const { id } = req.query;
			const { userId } = req;

			if (id === "all") {
				const [count] = await Notifications.update({ isRead: true }, { where: { userId } });
				return res.status(200).json(count > 0);
			} else {
				const [count] = await Notifications.update({ isRead: true }, { where: { id } });
				return res.status(200).json(count > 0);
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
