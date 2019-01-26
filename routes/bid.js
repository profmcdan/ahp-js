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
router.get("/", (req, res) => {
	let errors = {};
	Bid.find()
		.then((bids) => {
			if (!bids) {
				return res.status(404).json({ error: "There are no bids" });
			}
			return res.json(bids);
		})
		.catch((err) => res.status(404).json(err));
});

// @route   GET api/profile
// @desc    Get all bids
// @access  Private
router.get("/:id", (req, res) => {
	let errors = {};
	Bid.findById(req.params.id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "This bid does not exist" });
			}
			return res.json({ bid });
		})
		.catch((err) => res.status(404).json(err));
});

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
			console.log(criteria_id);

			bid.criteria.id(criteria_id).subcriteria.unshift({ title, description });
			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					console.log(error);
					return res.status(500).json({ error });
				});
		})
		.catch((err) =>
			res.status(404).json({
				error: "No bid found with that ID"
			})
		);
});

router.post("/:id/criteria", (req, res) => {
	const { id } = req.params;
	const { criteria_id, sub_list } = req.body;

	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "No bid found with that ID" });
			}
			if (sub_list.length > 0) {
				sub_list.forEach((sub) => {
					bid.criteria.id(criteria_id).subcriteria.unshift({ title: sub });
				});
			}

			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					console.log(error);
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
	const { bid_price, name, phone, email, address } = req.body;

	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.status(404).json({ error: "No bid found with that ID" });
			}
			bid.contractors.unshift({ name, phone, email, address, bid_price });
			bid
				.save()
				.then((bid) => {
					return res.status(201).json({ bid });
				})
				.catch((error) => {
					console.log(error);
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
