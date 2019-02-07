const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");
const apiKey = require("../config/keys").config.cloudinaryConfig;
cloudinary.config(apiKey);

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

router.get("/opened", (req, res) => {
	let errors = {};
	Bid.find({ activated: true, closed: false })
		.then((bids) => {
			if (!bids) {
				return res.status(404).json({ error: "There are no bids" });
			}
			return res.json(bids);
		})
		.catch((err) => res.json(err));
});

router.post("/:id/activate", (req, res) => {
	let activated;
	Bid.findById(req.params.id).then((bid) => {
		if (!bid) {
			return re.json({ status: "404", error: "Not Found" });
		}
		if (bid.activated) {
			bid.activated = false;
		} else {
			bid.activated = true;
		}
		bid
			.save()
			.then((updatedBid) => {
				return res.json(updatedBid);
			})
			.catch((error) => {
				return res.json({ status: "500", error: error });
			});
	});
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
			return res.json({ bid: bid, status: "Got one not all" });
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
router.post("/:id/subcriteria", (req, res) => {
	const { id } = req.params;
	const { title, description, criteria_id } = req.body;

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

router.post("/:id/subcriteria1", (req, res) => {
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
				return res.json({ error: "No bid found with that ID", statusCode: 404 });
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
			res.json({
				error,
				statusCode: 500
			})
		);
});

// @route   DELETE
// @desc    delete contractor
// @access  [Private]
router.delete("/:id/contractor/:contractor_id", (req, res) => {
	const { id, contractor_id } = req.params;
	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.json({ error: "No bid found with that ID", statusCode: 404 });
			}
			bid.contractors.id(contractor_id).remove();
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
			res.json({
				error,
				statusCode: 500
			})
		);
});

// @route   DELETE
// @desc    delete criteria
// @access  [Private]
router.delete("/:id/criteria/:criteria_id", (req, res) => {
	const { id, criteria_id } = req.params;
	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.json({ error: "No bid found with that ID", statusCode: 404 });
			}
			bid.criteria.id(criteria_id).remove();
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
			res.json({
				error,
				statusCode: 500
			})
		);
});

// @route   DELETE
// @desc    delete sub-criteria
// @access  [Private]
router.delete("/:id/criteria/:criteria_id/sub/:sub_id", (req, res) => {
	const { id, criteria_id, sub_id } = req.params;
	Bid.findById(id)
		.then((bid) => {
			if (!bid) {
				return res.json({ error: "No bid found with that ID", statusCode: 404 });
			}
			bid.criteria.id(criteria_id).subcriteria.id(sub_id).remove();
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
			res.json({
				error,
				statusCode: 500
			})
		);
});

// Upload file for alternative
router.post("/:id/alternative/upload", (req, res) => {
	// console.log("Uploading file...");
	let filename = "";
	const values = Object.values(req.files);
	const promises = values.map((document) => cloudinary.uploader.upload(document.path));
	Promise.all(promises)
		.then((results) => {
			filename = results[0].secure_url;
			console.log(results);
			const { file_title, contractor_id } = req.body;
			const { id } = req.params;
			console.log(req.files);

			Bid.findById(id)
				.then((bid) => {
					if (!bid) {
						return res.status(404).json({ error: "No bid found with that ID" });
					}
					console.log(bid);

					bid.contractors.id(contractor_id).documents.unshift({ file_title, filename });
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
				.catch((error) => {
					console.log(error);
					return res.status(500).json({ error });
				});
		})
		.catch((error) => {
			return res.status(500).json({ error: "Error uploading file to server" });
		});
});

router.post("/upload", function(req, res) {
	var form = new formidable.IncomingForm();

	form.parse(req);

	form.on("fileBegin", function(name, file) {
		file.path = __dirname + "/uploads/" + file.name;
	});

	form.on("file", function(name, file) {
		console.log(file);
		console.log("Uploaded " + file.name);
	});

	return res.json({ file: "File Uploaded" });
});

module.exports = router;
