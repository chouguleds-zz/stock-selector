'use strict';

var bodyParser = require('body-parser')
var helmet=require('helmet');
module.exports = function(app) {

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}))
	app.use(helmet());
}