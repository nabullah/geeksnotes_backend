require("dotenv").config();
const express = require("express");
const swaggerDocs = require("./swagger.js");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const path = require("path");

var corsOptions = {
	origin: ["http://localhost:4200", "http://localhost:4500"],
	optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("*", cors());
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/* Server Listen */
app.listen(PORT, () => {
	console.log("Server is running on Port ", PORT);
	swaggerDocs(app, 3000);
});

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
	// Rendering our web page i.e. Demo.ejs
	// and passing title variable through it
	res.render("home", {
		title: "GeeksNotes API",
	});
});

/* API Routers */
const userRouter = require("./routes/user.js");
const uploadFilesRouter = require("./routes/upload_files.js");
const otpRouter = require("./routes/otp.js");
const notesRouter = require("./routes/notes.js");
const NotificationsRouter = require("./routes/notifications.js");

app.use("/api/user", userRouter);
app.use("/api/upload", uploadFilesRouter);
app.use("/api", otpRouter);
app.use("/api/notes", notesRouter);
app.use("/api/notifications", NotificationsRouter);

module.exports = app;
