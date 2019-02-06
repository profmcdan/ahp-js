const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");

const User = require("../models/User");

// @desc POST Register User
// api/auth/register
// Public
router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		console.log(errors);
		return res.json({ error: errors });
	}

	User.findOne({
		email: req.body.email
	})
		.then((user) => {
			if (user) {
				return res.json({
					error: "Email already exists"
				});
			} else {
				const avatar = gravatar.url(req.body.email, {
					s: "200",
					r: "pg",
					d: "mm"
				});
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					avatar
				});

				bcrypt.genSalt(10, (err, salt) => {
					if (err) {
						console.log("There was an error", err);
					} else {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) {
								console.log("There was an error", err);
							} else {
								newUser.password = hash;
								newUser.save().then((user) => {
									res.json(user);
								});
							}
						});
					}
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

// @desc POST Login User
// api/auth/login
// Public
router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then((user) => {
		if (!user) {
			errors.email = "User not found";
			return res.json({ statusCode: 404, errors });
		}

		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				const payload = {
					id: user.id,
					name: user.name,
					email: user.email,
					avartar: user.avartar
				};
				jwt.sign(payload, "secret", { expiresIn: 3600 * 24 }, (err, token) => {
					if (err) {
						console.log("There is error in the token", err);
					} else {
						res.json({
							success: true,
							token: `Bearer ${token}`
						});
					}
				});
			} else {
				errors.password = "Incorrect Password";
				return res.status(400).json(errors);
			}
		});
	});
});

// @desc GET Current User
// api/auth/me
// Private
router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
	return res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
		avartar: req.user.avartar
	});
});

module.exports = router;
