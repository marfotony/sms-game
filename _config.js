
var config = {};

var mongoHost = process.env.MONGO_HOST || 'localhost'
config.mongoURI = {
	production: 'mongodb://' + mongoHost + '/sms-game',
	development: 'mongodb://' + mongoHost + '/sms-game-dev',
	test: 'mongodb://' + mongoHost + '/sms-game-test'
};

module.exports = config;