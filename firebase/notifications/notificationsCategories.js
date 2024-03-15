const notificationsTypesConst = require("../notifications/notificationTypes");

const NOTIFICATION_TYPES = {
	getNotificationType: (data, type) => {
		const firebaseNotificationsCategories = {
			[notificationsTypesConst.FILE_UPLOAD]: {
				title: "New Notification",
				body: `${data.fileName} has been successfully published.`,
			},
		};

		return firebaseNotificationsCategories[type];
	},
};

module.exports = NOTIFICATION_TYPES;