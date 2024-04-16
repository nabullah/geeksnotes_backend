"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1;
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.AcademicDetails = require("./academicdetails")(sequelize, Sequelize);
db.UserRole = require("./userroles")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.OTP = require("./otp")(sequelize, Sequelize);
db.ViewsFiles = require("./views_file")(sequelize, Sequelize);
db.UploadFiles = require("./upload_files")(sequelize, Sequelize);
db.LikesFiles = require("./likes_file")(sequelize, Sequelize);
db.Notifications = require("./notifications")(sequelize, Sequelize);
db.FilesThumbnails = require("./files_thumbnails")(sequelize, Sequelize);
db.Reviews = require("./reviews")(sequelize, Sequelize);
db.Ratings = require("./ratings")(sequelize, Sequelize);



db.User.belongsTo(db.UserRole, { foreignKey: "userRoleId", as: "role" });
db.User.hasOne(db.AcademicDetails, {
	as: "academicDetails",
	foreignKey: "id",
	sourceKey: "academicsDetailId",
});

db.UploadFiles.hasOne(db.User, { foreignKey: "id", sourceKey: "userId", as: "user" });
db.UploadFiles.hasMany(db.LikesFiles, { foreignKey: "fileId", as: "likes" });
db.UploadFiles.hasOne(db.ViewsFiles, { foreignKey: "fileId", as: "views" });
db.UploadFiles.hasOne(db.FilesThumbnails, { foreignKey: "fileId", as: "thumbnails" });

db.LikesFiles.belongsTo(db.UploadFiles, { foreignKey: "fileId" });

db.Reviews.hasOne(db.Ratings, { foreignKey: "reviewId", as: "ratings" });
db.Reviews.hasOne(db.User, { sourceKey: "userId", foreignKey: "id", as: "user" });



db.User.findAll().then((users) => {
	console.log("\x1b[36m%s\x1b[0m", "Connected To database >>>");
});


module.exports = db;
