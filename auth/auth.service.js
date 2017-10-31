var jwt = require('jsonwebtoken');
var config = require('../config')
var User = require('../app/users/users.model')


//middleware to authenticate user for every request made
exports.isAuthenticated = function() {

	return function(req, res, next) {

		var token = null;

		if (req.query && req.query.hasOwnProperty('access_token')) {

			token = req.query.access_token;
		}

		//varify jwt using the secret used
		jwt.verify(token, config.secrets.session, function(err, decoded) {

			if (err) {

				res.status(500).json({
					message: "invalid token",
					data: err
				});
				return;
			}
			User.findById(decoded._id)
				.then(function(user) {

					//if user is not present respond unauthorized
					if (!user) {

						return res.status(401).end();
					}
					req.user = user;
					next();
				})
				.catch(err => next(err));
		})
	}
}

//sign jwt token
exports.signToken = function(id) {

	return jwt.sign({
		_id: id
	}, config.secrets.session, {
		expiresIn: 60 * 60 * 10
	});
}