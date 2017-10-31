var path = require('path')
module.exports = {

	mongo: {

		uri: 'mongodb://localhost/my_feeds'
	},
	port: 9000,
	secrets: {

		session: "my-secret"
	},
	root: path.normalize(__dirname + '/../../..')
}