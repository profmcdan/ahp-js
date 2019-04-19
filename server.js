const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const formData = require("express-form-data");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const config = require("./db");

const app = express();
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "client", "build")));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formData.parse());
app.use(cors());

const usersRoute = require("./routes/user");
const bidsRoute = require("./routes/bid");
const contractorRoute = require("./routes/contractor");
const decisionRoute = require("./routes/decision");
const computeRoute = require("./routes/compute");

mongoose
  .connect(config.DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected");
  })
  .catch(err => {
    console.log("Cannot connect to the database: " + err);
  });

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", usersRoute);
app.use("/api/bid", bidsRoute);
app.use("/api/alternative", contractorRoute);
app.use("/api/decision", decisionRoute);
app.use("/api/compute", computeRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
