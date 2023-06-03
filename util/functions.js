const jwt = require("jsonwebtoken");
require("dotenv").config();

const colors = ["#002B5B", "#1A5F7A", "#57C5B6", "#EBB02D", "#F7DB6A", "#7AA874", "#159895", "#FC2947", "#FE6244", "#245953", "#EA5455", "#2D2727", "#2C3333", "#0F6292"];

module.exports = {
	// Generate Random Colors from 'colors' array above
	randomColors: () => {
		let randomIndex = Math.floor(Math.random() * colors.length);
		return colors[randomIndex];
	},
};
