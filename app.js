require("dotenv").config();
const express = require("express");
const swaggerDocs = require("./swagger.js");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("*", cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* Server Listen */
app.listen(PORT, () => {
	console.log("Server is running on Port ", PORT);
	swaggerDocs(app, 3000);
});

/* API Routers */
const userRouter = require("./routes/user.js");
const uploadFilesRouter = require("./routes/upload_files.js");
const otpRouter = require("./routes/otp.js");

app.use("/api/user", userRouter);
app.use("/api/upload", uploadFilesRouter);
app.use("/api", otpRouter);

module.exports = app;
