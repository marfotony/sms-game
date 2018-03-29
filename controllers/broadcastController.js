var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('../models/User');

var twilio = require('twilio');

router.use(bodyParser.json());

const broadcastSMS = (number) => {
	var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
	var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

	var client = new twilio(accountSid, authToken);

	client.messages.create({
	    body: 'The Intility T-Rex is loose! Find it and reply with the 4-digit code on its back to gain points! Send stop to unsubscribe',
	    to: number,  // Text this number
	    from: '+4759444250' // From a valid Twilio number
	})
	.then((message) => console.log(message.sid));
}

const broadcastThanksForPlaying = (number) => {
	var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
	var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

	var client = new twilio(accountSid, authToken);

	client.messages.create({
	    body: 'The Intility T-Rex game is finished for today and the scores will now reset. The winner will be contacted by SMS. Hunt again tomorrow for a new chance to win!',
	    to: number,  // Text this number
	    from: '+4759444250' // From a valid Twilio number
	})
	.then((message) => console.log(message.sid));
}

router.get('/', function(req, res) {
	User.find({ isActive: true }, function(err, users) {
		if (err) return res.status(500).json("Error getting users: " + err);

		users.map((user) => {
			broadcastThanksForPlaying(user.phoneNumber);
		}); 

		res.status(200).json("broadcast ok");
	});
});

module.exports = router;