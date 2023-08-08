"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("upload_files", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			filePath: {
				type: Sequelize.STRING,
			},
			userId: {
				type: Sequelize.INTEGER,
			},
			fileName: {
				type: Sequelize.STRING,
			},
			fileType: {
				type: Sequelize.STRING,
			},
			audienceRolesIds: {
				type: Sequelize.JSON,
				defaultValue: [],
			},
			isPrivate: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			topic: {
				type: Sequelize.STRING,
			},
			subTopic: {
				type: Sequelize.STRING,
			},
			description: {
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
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("upload_files");
	},
};
