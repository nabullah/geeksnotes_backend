"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			fullName: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			address: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			mobile: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			dob: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				enum: ["active", "blocked"],
				defaultValue: 'active'
			},
			userRoleId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			color: {
				type: Sequelize.STRING,
			},
			academicsDetailId: {
				type: Sequelize.INTEGER,
			},
			profession: {
				type: Sequelize.STRING,
			},
			permission: {
				type: Sequelize.STRING,
				default: "user",
			},
			fcmToken: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			isVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("users");
	},
};
