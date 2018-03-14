
var config = {};

config.mongoURI = {
	production: 'mongodb://localhost/sms-game',
	development: 'mongodb://localhost/sms-game-dev',
	test: 'mongodb://localhost/sms-game-test'
};

module.exports = config;