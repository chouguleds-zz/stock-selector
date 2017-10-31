var path = require('path')

module.exports = {

	mongo: {

		uri: 'mongodb://localhost/my_feeds-test'
	},
	port: 9000,
	secrets: {

		session: "my-test-secret"
	},
	root: path.normalize(__dirname + '/../../..')
}