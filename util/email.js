const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = "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";

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
	sendOTPEmail: async (data) => {
		const msg = {
			to: data.email,
			from: {
				email: process.env.sendGridFromEmail,
				name: process.env.emailSenderName,
			},
			subject: "One Time Password",
			text: `Hello ${data.name}, Your OTP is ${data.otp}`,
			html: `
			<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
				<div style="margin: 50px auto; width: 70%; padding: 20px 0">
					<div style="border-bottom: 1px solid #eee">
						<a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">Geeks Notes</a>
					</div>
					<p style="font-size: 1.1em">Hi ${data.name},</p>
					<p>Thank you for choosing GeeksNotes. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes.</p>
					<h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px">${data.otp}</h2>
					<p style="font-size: 0.9em">Regards,<br />Geeks Notes Support</p>
					<hr style="border: none; border-top: 1px solid #eee" />
				
				</div>
			</div>

			`,
		};

		sgMail
			.send(msg)
			.then((response) => {
				console.log("Email sent", response);
				return response;
			})
			.catch((error) => {
				return error;
			});
	},
};
