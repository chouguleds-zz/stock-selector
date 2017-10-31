'use strict';

var users = require('./app/users');
var auth = require('./auth')
var userPosts = require('./app/user_posts')
var userFollowing = require('./app/user_following')

module.exports = function(app) {

	//patent level routes 
	app.use('/api/users', users);
	app.use('/api/user_posts', userPosts);
	app.use('/api/user_following', userFollowing);
	app.use('/auth', auth)
}