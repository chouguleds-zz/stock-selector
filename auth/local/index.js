'use strict';

var express = require('express');
var authService = require('../auth.service');
var User = require('../../app/users/users.model.js')

var router = express.Router();

//login api
router.post('/', function(req, res) {

	//find if user present or not
	User.findOne({
			email: req.body.email
		})
		.then(function(user) {

			if (user === null) {

				res.status(404).json({
					success: false,
					message: "invalid user email"
				})
				return;
			}
			//authenticate user password
			if (!user.authenticate(req.body.password)) {

				res.status(401).send({

					message: 'Invalid password'
				});
				return;
			}
			//sign token with user's _id
			var token = authService.signToken(user._id)
			res.status(200).json({
				success: true,
				message: "login success.",
				token: token
			});
		})
		.catch(function(err) {

			res.status(500).json({
				success: false,
				message: "internal server error"
			});
		})
});

module.exports = router;