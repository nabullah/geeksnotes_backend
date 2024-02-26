const OTP = require("../models").OTP;
const otpGenerator = require("otp-generator");

function AddMinutesToDate(date, minutes) {
	return new Date(date.getTime() + minutes * 60000);
}

module.exports = {
	sendOTP: async (user_id) => {
		const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
		const now = new Date();
		const expiration_time = AddMinutesToDate(now, 5).toISOString();
		const OTPInstance = await OTP.create({
			otp: otp,
			expirationTime: expiration_time,
			userId: user_id,
		});
		console.log("OTP >>>>>>>>>>>>>>>> ", OTPInstance["otp"]);
		return OTPInstance ? OTPInstance : null;
	},

	resendOTP: async (user_id) => {
		const OTPInstance = await OTP.findOne({
			where: {
				userId: user_id,
			},
		});
		const nowDate = new Date();
		if (OTPInstance) {
			const expirationTime = OTPInstance["dataValues"]["expirationTime"];
			if (nowDate < expirationTime) {
				return OTPInstance;
			} else {
				const expiration_time = AddMinutesToDate(nowDate, 5).toISOString();
				const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
				await OTP.update({ otp: otp, expirationTime: expiration_time }, { where: { userId: user_id } });
				return await OTP.findOne({ where: { userId: user_id } });
			}
		} else {
			return module.exports.sendOTP(user_id);
		}
	},
};
