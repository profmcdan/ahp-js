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

C = [
	[ [ 1, 1, 1 ], [ 1, 1, 1 ], [ 4, 5, 6 ], [ 6, 7, 8 ], [ 4, 5, 6 ] ],
	[ [ 1, 1, 1 ], [ 1, 1, 1 ], [ 4, 5, 6 ], [ 6, 7, 8 ], [ 6, 7, 8 ] ],
	[ [ 1 / 6, 1 / 5, 1 / 4 ], [ 1 / 6, 1 / 5, 1 / 4 ], [ 1, 1, 1 ], [ 1 / 4, 1 / 3, 1 / 2 ], [ 2, 3, 4 ] ],
	[ [ 1 / 8, 1 / 7, 1 / 6 ], [ 1 / 8, 1 / 7, 1 / 6 ], [ 2, 3, 4 ], [ 1, 1, 1 ], [ 1 / 6, 1 / 5, 1 / 4 ] ],
	[ [ 1 / 6, 1 / 5, 1 / 4 ], [ 1 / 8, 1 / 7, 1 / 6 ], [ 1 / 4, 1 / 3, 1 / 2 ], [ 4, 5, 6 ], [ 1, 1, 1 ] ]
];
// CRITERIA_MATRIX = []
let SUBCRITERIA_MATRIX = [];
let ALTERNATIVE_MATRIX = [];
// bid_price = 0
// estimated_price = 0
// threshold = 0
// contractor_names = []

const AHPModel = require("./helpers/ahp");
let cModel = new AHPModel(C, SUBCRITERIA_MATRIX, ALTERNATIVE_MATRIX);
console.log(cModel.evaluate_criteria());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
