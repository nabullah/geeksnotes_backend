const jwt = require("jsonwebtoken");
const SECRET_KEY = "6hEVETCGQJ5xmVMA235467uyjhtrety5yrt$tgw54teg#$%##%g#$#$6e9GasasdasdXjeWDEE5AHiaOaXXFcVNiC548=34rgsfdfwer23rwfasdA@#$%gfsdf#%$t%trfsdda";
const User = require("../models").User;

module.exports = {
	jwtToken: async (req, res, next) => {
		try {
			let token1 = req.headers["authorization"];
			let token2 = token1.split(" ")[1];
			let token = jwt.verify(token2, SECRET_KEY);
			if (token) {
				let userData = await User.findOne({ where: { id: token.id } });
				if (userData) {
					if (userData.status == "blocked") {
						res.send({ code: 401, data: [], message: "User is Blocked. Please Contact the Administer" });
					}
					//  else {
					// 	req.userId = userData._id;
					// 	next();
					// }
					if (userData.userRole === "admin") {
						// Admin has access to all endpoints, so continue to the next middleware
						req.userId = userData._id;
						req.userRole = userData.userRole;
						next();
					} else {
						// For non-admin users, you can add specific checks here based on your requirements.
						// For example, if certain endpoints are accessible only to regular users, handle it accordingly.
						return res.status(403).json({ message: "Access Forbidden. You don't have the necessary permissions to perform this action." });
					}
				}
			}
		} catch (error) {
			return res.send({
				responseCode: 501,
				message: "You must be logged in to perform this action. Please log in and try again !!",
				responseMessage: error.message,
			});
		}
	},
};
