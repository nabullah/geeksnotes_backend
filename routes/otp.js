const otpRouter = require("express").Router();
const OTPController = require("../controller/core/otp");

/**
 * @openapi
 * '/api/verifyOTP':
 *  post:
 *     tags:
 *     -  OTP
 *     summary: Generate One Time Password
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 required: true
 *               otp:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Success
 */

otpRouter.post("/verifyOTP", OTPController.verifyOTP);

/**
 * @openapi
 * '/api/resendOTP':
 *  post:
 *     tags:
 *     - OTP
 *     summary: Resend One Time Password
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Success
 */
otpRouter.post("/resendOTP", OTPController.resendOTP);

module.exports = otpRouter;
