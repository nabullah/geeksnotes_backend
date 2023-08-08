const swaggerJsdoc = require("swagger-jsdoc"),
	swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Geeks Notes",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
			  JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
			  },
			},
		},
		security: {
			bearerAuth: [],
		},
	},
	// looks for configuration in specified directories
	apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
	// Swagger Page
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// Documentation in JSON format
	app.get("/docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};

module.exports = swaggerDocs;
