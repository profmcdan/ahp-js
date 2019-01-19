const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
// const validateProfileInput = require('../../validation/profile');

// Load User model
const Contractor = require("../models/Contractor");

// @route   GET contractors
// @desc    get all contractor
// @access  [Private]
router.get("/", (req, res) => {
	Contractor.find()
		.then((contractors) => {
			return res.status(201).json({ contractors });
		})
		.catch((error) => {
			return res.status(500).json({ error });
		});
});

// @route   POST contractor
// @desc    create new contractor
// @access  [Private]
router.post("/", (req, res) => {
	const { name, email, phone, address } = req.body;
	const newContractor = new Contractor({ name, email, phone, address });
	newContractor
		.save()
		.then((contractor) => {
			return res.status(201).json({ contractor });
		})
		.catch((error) => {
			return res.status(500).json({ error });
		});
});

// @route   POST contractor/add-document
// @desc    create new contractor
// @access  [Private]
router.post("/:id/document", (req, res) => {
	const { name, email, phone, address } = req.body;
	const newContractor = new Contractor({ name, email, phone, address });
	newContractor
		.save()
		.then((contractor) => {
			return res.status(201).json({ contractor });
		})
		.catch((error) => {
			return res.status(500).json({ error });
		});
});

module.exports = router;
