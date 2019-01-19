const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Bid = require("../models/Bid");
const Contractor = require("../models/Contractor");
const Decision = require("../models/Decision");

// @desc GET Current User
// api/auth/me
// Private
router.get("/criteria", (req, res) => {
	return res.json({});
});

module.exports = router;
