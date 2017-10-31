'use strict';

var Joi = require('joi');

/*validation middleware for express to validate the arguments being passed*/
module.exports = function(schema) {

	return function(req, res, next) {

		Joi.validate(req.body, schema, function(err, value) {

			if (err) {
				res.status(500).json({
					success: false,
					message: "invalid arguments",
					data: err
				})
				return;
			}
			req.body = value;
			next();
		})
	}
}