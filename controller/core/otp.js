const OTP = require("../../models").OTP;
const User = require("../../models").User;
const OTPGenerator = require("../../util/OTP");
const sendOTPEmail = require("../../util/email");
// const otpGenerator = require("otp-generator");

const OTPController = {
	verifyOTP: async (req, res) => {
		try {
			const { otp, userId } = req.body;
			const OTPInstance = await OTP.findOne({
				where: {
					otp: otp,
					userId: userId,
				},
				limit: 1000,
				order: [["createdAt", "DESC"]],
			});
			if (OTPInstance) {
				const now = new Date().toISOString();
				const expirationTime = OTPInstance["dataValues"]["expirationTime"];
				if (now < expirationTime && OTPInstance["dataValues"]["verified"] === false) {
					await OTP.update({ verified: true }, { where: { userId: userId } });
					return res.status(200).json({ message: "OTP Verified Successfully.", data: null, status: true });
				} else if (OTPInstance["dataValues"]["verified"] === true) {
					return res.status(200).json({ message: "OTP Invalid, Please retry again.", data: null, status: false });
				} else {
					return res.status(200).json({ message: "OTP Expired, Please resend OTP again.", data: null, status: false });
				}
			} else {
				return res.status(400).json({ message: "OTP not found", data: null, status: false });
			}
		} catch {
			return res.status(500).json({
				status: false,
				message: "We're experiencing technical difficulties at the moment. Please try again later or contact our support team for assistance.",
				result: error.message,
			});
		}
	},

	resendOTP: async (req, res) => {
		try {
			const user = await User.findOne({ where: { email: req.body.email } });
			if (user) {
				const resendOTP = await OTPGenerator.resendOTP(user.id);
				if (resendOTP) {
					const values = {
						email: user.email,
						otp: resendOTP.otp,
						name: user.fullName,
					};
					await sendOTPEmail.sendOTPEmail(values);
					console.log("OTP Resent", values);
					return res.status(200).json({ message: "OTP Resent, Please check your email.", data: null, status: true });
				} else {
					return res.status(200).json({ message: "OTP Resend failed, Please try again.", data: null, status: false });
				}
			} else {
				return res.status(400).json({ message: "This email is not associated with any user. Please check your email id.", data: null, status: false });
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

module.exports = OTPController;
