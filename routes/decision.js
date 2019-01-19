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
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
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

// @route   POST decision
// @desc    create new bid
// @access  [Private]
router.post("/:bid_id", passport.authenticate("jwt", { session: false }), (req, res) => {
	const { bid_id } = req.params;
	const { to, from, weight, contractor_id } = req.body;
	Bid.findById(bid_id).then((bid) => {
		if (!bid) {
			return res.status(404).json({ error: "Bid with that ID not found" });
		}
		// [TODO] : Check that the user has not created any response earlier
		Decision.findOne({
			maker: req.user.id,
			bid: bid_id,
			contractor: contractor_id
		}).then((decision) => {
			if (decision) {
				return res.json({ error: "you already have a response for this bid, update it instead" });
			}

			// Get ready to create decision maker's response
			const newDecision = new Decision({
				maker: req.user.id,
				bid: bid_id,
				contractor: contractor_id
			});
			newDecision
				.save()
				.then((decision) => {
					return res.status(201).json({ decision });
				})
				.catch((error) => {
					return res.status(500).json({ error });
				});
		});
	});
});

// @route   POST decision
// @desc    create new bid
// @access  [Private]
router.post("/:id/criteria", passport.authenticate("jwt", { session: false }), (req, res) => {
	const { id } = req.params;
	const { to, from, weight } = req.body;
	Decision.findById(id)
		.then((decision) => {
			if (!decision) {
				return res.status(404).json({ error: "Decision does not exists" });
			}
			const newResponse = {
				to,
				from,
				weight
			};
			decision.criteria.unshift(newResponse);
			decision
				.save()
				.then((decision) => {
					return res.json({ decision });
				})
				.catch((error) => {
					return res.status(500).json({ error });
				});
		})
		.catch((error) => {
			return res.status(500).json({ error });
		});
});

module.exports = router;
