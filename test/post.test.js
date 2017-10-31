'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../app/users/users.model');
var UserPosts = require('../app/user_posts/user_post.model');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('User Posts', function() {

	//Before each test we empty the database
	beforeEach(function(done) {

		User.remove({}, function(err) {
			UserPosts.remove({}, function(err) {
				done();
			});
		});
	});
	/*
	 * Test the /CREATE route
	 */
	describe('/CREATE Post', function() {

		it('it should create new post to db', function(done) {


			var user = {
				name: "deepak",
				email: "chougule.ds@gmail.com",
				password: "deepak"
			};
			new User(user).save()
				.then(function(savedUser) {

					var post = {
						user_id: savedUser._id,
						"text": "my post"
					}
					//console.log(savedUser)
					chai.request(server)
						.post('/api/user_posts/create')
						.send(post)
						.then(function(res) {

							//console.log(res)
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('success').eql(true);
							res.body.should.have.property('message').eql('post created');
							done();
						})
						.catch(function(err) {
							throw err;
						})
				})
		});
	});

});