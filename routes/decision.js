const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
// const validateProfileInput = require('../../validation/profile');

// Load User model
const Decision = require("../models/Decision");
const Bid = require("../models/Bid");

// @route   GET api/decision
// @desc    Get all decisions
// @access  Private
router.get("/", (req, res) => {
	let errors = {};
	Decision.find()
		.then((decisions) => {
			if (!decisions) {
				return res.status(404).json({ error: "There are no decisions" });
			}
			return res.json(decisions);
		})
		.catch((err) => res.status(404).json(err));
});

router.get("/:bid_id/:user_id", (req, res) => {
	let errors = {};
	Decision.findOne({
		maker: req.params.user_id,
		bid: req.params.bid_id
	})
		.then((decisions) => {
			if (!decisions) {
				return res.json({ errors: "There are no decisions" });
			}
			return res.json({ decision: decisions });
		})
		.catch((err) => res.json({ err, statusCode: 500 }));
});

// @route   POST decision
// @desc    create new bid
// @access  [Private]
router.post("/:bid_id/:user_id", (req, res) => {
	const { bid_id, user_id } = req.params;
	// const { contractor_id } = req.body;
	Bid.findById(bid_id).then((bid) => {
		if (!bid) {
			return res.status(404).json({ error: "Bid with that ID not found" });
		}
		// [TODO] : Check that the user has not created any response earlier
		Decision.findOne({
			maker: user_id,
			bid: bid_id
		}).then((decision) => {
			if (decision) {
				return res.json({ error: "you already have a response for this bid, update it instead" });
			}

			// Get ready to create decision maker's response
			const newDecision = new Decision({
				maker: user_id,
				bid: bid_id
			});
			newDecision
				.save()
				.then((decision) => {
					return res.json({ status: 201, decision: decision });
				})
				.catch((error) => {
					return res.json({ status: 500, error });
				});
		});
	});
});

router.get("/:id", (req, res) => {
	Decision.findById(req.params.id).then((decision) => {
		if (!decision) {
			return res.json({ error: "Decision does not exists", statusCode: 404 });
		}
		return res.json({ decision });
	});
});

// @route   POST decision
// @desc    create new bid
// @access  [Private]
router.post("/add/:id/criteria", (req, res) => {
	const { id } = req.params;
	const { from, to, weight } = req.body;

	Decision.findById(id)
		.then((decision) => {
			if (!decision) {
				return res.json({ error: "Decision does not exists", statusCode: 404 });
			}

			decision.response.criteria.push({
				to: to.toLowerCase(),
				from: from.toLowerCase(),
				weight: weight
			});

			return decision
				.save()
				.then((decision) => {
					//  do nothing
					return res.json({ decision });
				})
				.catch((error) => {
					return res.json({ error, statusCode: 500 });
				});
		})
		.catch((error) => {
			return res.json({ error, statusCode: 500 });
		});
});

// @route   POST decision
// @desc    create new bid
// @access  [Private]
router.post("/add/:id/alternative/:sub_id", (req, res) => {
	const { id, sub_id } = req.params;
	const { from, to, weight } = req.body;

	Decision.findById(id)
		.then((decision) => {
			if (!decision) {
				return res.json({ error: "Decision does not exists", statusCode: 404 });
			}

			const newResponse = {
				criteria: sub_id,
				subcriteria: {
					to: to.toLowerCase(),
					from: from.toLowerCase(),
					weight
				}
			};

			decision.response.alternative.push(newResponse);

			return decision
				.save()
				.then((decision) => {
					//  do nothing
					return res.json({ decision });
				})
				.catch((error) => {
					return res.json({ error, statusCode: 500 });
				});

			// decision.response.criteria.unshift({ scores });

			// decision.response.criteria.unshift({
			// 	to: to.toLowerCase(),
			// 	from: from.toLowerCase(),
			// 	weight
			// });
		})
		.catch((error) => {
			return res.json({ error, statusCode: 500 });
		});
});

// @route   POST decision
// @desc    add sub-criteria resp
// @access  [Private]
router.post("/add/:id/sub-criteria", (req, res) => {
	const { id } = req.params;
	const { to, from, weight, criteria_id } = req.body;
	Decision.findById(id)
		.then((decision) => {
			if (!decision) {
				return res.status(404).json({ error: "Decision does not exists" });
			}
			const newResponse = {
				criteria: criteria_id,
				sub: {
					to: to.toLowerCase(),
					from: from.toLowerCase(),
					weight
				}
			};

			decision.response.subcriteria.push(newResponse);
			decision
				.save()
				.then((decision) => {
					return res.json({ decision });
				})
				.catch((error) => {
					return res.json({ error, statusCode: 500 });
				});
		})
		.catch((error) => {
			return res.json({ error, statusCode: 500 });
		});
});

module.exports = router;
