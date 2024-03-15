const firebase = require("../index");
const User = require("../../models").User;
const notificationType = require("../notifications/notificationsCategories");

async function getFcmTokenById(userId) {
	try {
		const gettingFcmToken = await User.findOne({ where: { id: userId } });
		let deviceToken = gettingFcmToken.fcmToken;
		if (deviceToken) return deviceToken;
		else return error("Device Token not found");
	} catch (error) {
		error("Error in getting fcm token", error);
	}
}

async function sendNotification(userId, messageData, type) {
	let token = await getFcmTokenById(userId);
	const message = {
		notification: notificationType.getNotificationType(messageData, type),
		token: token,
	};

	await firebase.admin
		.messaging()
		.send(message)
		.then((response) => {
			console.log("Notification sent successfully:", response);
		})
		.catch((error) => {
			console.error("Error sending notification:", error);
		});
}

module.exports = { sendNotification };
