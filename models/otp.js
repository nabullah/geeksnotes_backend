"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class OTP extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	OTP.init(
		{
			otp: DataTypes.STRING,
			expirationTime: DataTypes.STRING,
			verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "otps",
		}
	);
	return OTP;
};
