const otpRouter = require("express").Router();
const OTPController = require("../controller/core/otp");

otpRouter.post("/verifyOTP", OTPController.verifyOTP);
otpRouter.post("/resendOTP", OTPController.resendOTP);

module.exports = otpRouter;
