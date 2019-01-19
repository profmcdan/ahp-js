const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
// const validateProfileInput = require('../../validation/profile');

// Load User model
const Bid = require("../models/Bid");

// @route   GET api/profile
// @desc    Get all bids
// @access  Private
router.get(
	"/",
	passport.authenticate("jwt", {
		session: false
	}),
	(req, res) => {
		let errors = {};
		Bid.find()
			.then((bids) => {
				if (!bids) {
					errors.nobid = "There are no bids";
					return res.status(404).json(errors);
				}
				return res.json(bids);
			})
			.catch((err) => res.status(404).json(err));
	}
);

// @route   POST bid
// @desc    create new bid
// @access  [Private]
router.post("/", (req, res) => {
	const { name, description } = req.body;
	const newBid = new Bid({ name, description });
	newBid
		.save()
		.then((bid) => {
			return res.status(201).json({ bid });
		})
		.catch((error) => {
			return res.status(500).json({ error });
		});
});

// @route   POST
// @desc    add criteria
// @access  [Private]
router.post("/:id/criteria", (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "No bid found with that ID" });
			}
			bid.criteria.unshift({ title: title });
			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					return res.status(500).json({ error });
				});
		})
		.catch((err) =>
			res.status(404).json({
				error: "No bid found with that ID"
			})
		);
});

// @route   POST
// @desc    add sub-criteria
// @access  [Private]
router.post("/:id/criteria/:criteria_id", (req, res) => {
	const { id, criteria_id } = req.params;
	const { title, description } = req.body;

	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "No bid found with that ID" });
			}
			bid.criteria.id(criteria_id).subcriteria.unshift({ title, description });
			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					return res.status(500).json({ error });
				});
		})
		.catch((err) =>
			res.status(404).json({
				error: "No bid found with that ID"
			})
		);
});

// @route   POST
// @desc    add contractor
// @access  [Private]
router.post("/:id/contractor", (req, res) => {
	const { id } = req.params;
	const { contractor_id, bid_price } = req.body;

	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "No bid found with that ID" });
			}
			bid.contractors.unshift({ name: contractor_id, bid_price: bid_price });
			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					return res.status(500).json({ error });
				});
		})
		.catch((err) =>
			res.status(404).json({
				error: "No bid found with that ID"
			})
		);
});

module.exports = router;
