const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const config = require("./db");

const usersRoute = require("./routes/user");
const bidsRoute = require("./routes/bid");
const contractorRoute = require("./routes/contractor");
const decisionRoute = require("./routes/decision");

mongoose
	.connect(config.DB, { useNewUrlParser: true })
	.then(() => {
		console.log("Database Connected");
	})
	.catch((err) => {
		console.log("Cannot connect to the database: " + err);
	});

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
