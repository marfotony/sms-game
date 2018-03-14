const express = require('express'),
	auth = require('express-authentication'),
	basic = require('express-authentication-basic');

const app = express();
const port = process.env.PORT || 3000;

var db = require('./db');


var login = basic(function verify(challenge, callback) {
	if (challenge.username === 'admin' && challenge.password === 'secret') {
		callback(null, true, { user: 'twilio' });
	} else {
		callback(null, false, { error: 'INVALID_PASSWORD' });
	}
});

app.use(login);

var UsersController = require('./controllers/usersController');
var CodesController = require('./controllers/codesController');
var AttemptsController = require('./controllers/attemptsController');

app.use('/users', auth.required(), UsersController);
app.use('/codes', auth.required(), CodesController);
app.use('/attempts', auth.required(), AttemptsController);



app.listen(port, () => console.log('sms-game listening on port 3000!'));

module.exports = app

/*
Environment variables:
TWILIO_USER
TWILIO_PW

ADMIN_USER
ADMIN_PW

Twilio integration must have basic auth.
POST /users (phoneNumber, username)
POST /attempts (phoneNumber, code)

Admin page must have basic auth.
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

GET /codes
GET /codes/:id
POST /codes
PUT /codes/:id
DELETE /codes/:id

GET /attempts
GET /attempts/:id
POST /attempts
PUT /attempts/:id
DELETE /attempts/:id

user: {
	"__v": 0,
    "_id": "5aa4301c6c935cbc0287022b",
    "phoneNumber": "+4792037340",
    "username": "callum0x50"
}

attempt: {
	phoneNumber: String,
	createdAt: Date,
	code: String
}

code: {
	code: String,
	createdAt: Date,
	activatesAt: Date,
	expiresAt: Date
}
*/















