'use strict';

//express initialization
var express = require('express');
var app = express();
var config = require('./config')

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//mongodb connection
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {

	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
});

//configure express
require('./config/express')(app)
//register routes on the app
require('./routes')(app);

var config = require('./config')

//start the server
var server = app.listen(config.port, function() {

	console.log("server started on port " + config.port)
})

module.exports = server;