const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const config = require("./db");

const users = require("./routes/user");
mongoose
	.connect(config.DB, { useNewUrlParser: true })
	.then(() => {
		console.log("Database Connected");
	})
	.catch((err) => {
		console.log("Cannot connect to the database: " + err);
	});

const app = express();
app.use(passport.initialize());
require("./passport");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Hello");
});

app.use("/api/auth", users);

const PORT = process.env.PORT || 5000;

const AHP = require("ahp");
var ahpContext = new AHP();

ahpContext.addItems([ "VendorA", "VendorB", "VendorC" ]);

ahpContext.addCriteria([ "price", "functionality", "UX" ]);

//rank criteria with rank scale
ahpContext.rankCriteriaItem("price", [
	[ "VendorB", "VendorC", 1 / 2 ],
	[ "VendorA", "VendorC", 1 / 2 ],
	[ "VendorA", "VendorB", 1 ]
]);

//rank criteria with rank scale
ahpContext.rankCriteriaItem("functionality", [
	[ "VendorB", "VendorC", 1 ],
	[ "VendorA", "VendorC", 5 ],
	[ "VendorA", "VendorB", 5 ]
]);

//rank criteria with absolute rank scole
ahpContext.setCriteriaItemRankByGivenScores("UX", [ 10, 10, 1 ]);

ahpContext.rankCriteria([ [ "price", "functionality", 3 ], [ "price", "UX", 3 ], [ "functionality", "UX", 1 ] ]);

let output = ahpContext.run();
console.log(output);

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
