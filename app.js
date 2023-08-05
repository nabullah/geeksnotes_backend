require("dotenv").config();
const express = require("express");
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
});

/* API Routers */
const userRouter = require("./routes/core/user");
app.use("/api/user", userRouter);
module.exports = app;
