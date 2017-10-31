'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../app/users/users.model');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', function() {

	//Before each test we empty the database
	beforeEach(function(done) {

		User.remove({}, function(err) {
			done();
		});
	});
	/*
	 * Test the /CREATE route
	 */
	describe('/CREATE user', function() {

		it('it should create new user to db', function(done) {

			var user = {
				name: "deepak",
				email: "chougule.ds@gmail.com",
				password: "deepak"
			};

			chai.request(server)
				.post('/api/users/create')
				.send(user)
				.then(function(res) {

					//console.log(res)
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('success').eql(true);
					res.body.should.have.property('message').eql('user registered');
					done();
				})
				.catch(function(err) {
					throw err;
				})
		});
		it('it should show error message if email already exists', function(done) {

			var user = {
				name: "deepak",
				email: "chougule.ds@gmail.com",
				password: "deepak"
			};
			new User(user)
				.save()
				.then(function(saveduser) {

					chai.request(server)
						.post('/api/users/create')
						.send(user)
						.then(function(res) {

							console.log(res.body)
							res.should.have.status(409);
							res.body.should.be.a('object');
							res.body.should.have.property('success').eql(false);
							res.body.should.have.property('message').eql('email already exists');
							done();
						})
						.catch(function(err) {
							throw err;
						})
				})
		});
	});


});