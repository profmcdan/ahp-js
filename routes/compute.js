const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Bid = require("../models/Bid");
const Contractor = require("../models/Contractor");
const Decision = require("../models/Decision");

// Load Helpers
const getCriteriaMatrix = require("../helpers/criteria");
const getSubCriteriaMatrix = require("../helpers/sub_criteria");
const AHP = require("../helpers/ahp");

// @desc GET Current User
// api/auth/me
// Private
router.get("/criteria/:bid_id/user/:user_id", (req, res) => {
	const { bid_id, user_id } = req.params;

	Decision.findOne({
		maker: user_id,
		bid: bid_id
	})
		.then((decision) => {
			if (!decision) {
				return res.json({ error: "Response not found", statusCode: 404 });
			}
			const criteria_matrix = getCriteriaMatrix(decision);
			const sub_criteria_matrix = getSubCriteriaMatrix(decision);
			// console.log(criteria_matrix);
			const ahpModel = new AHP(criteria_matrix);
			console.log(ahpModel.evaluate_criteria());
			console.log(sub_criteria_matrix[0]);
			return res.json({ criteria_matrix, sub_criteria_matrix });
		})
		.catch((error) => {
			console.log(error);
			return res.json({ error: error, statusCode: 500 });
		});
});

module.exports = router;
