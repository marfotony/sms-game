const express = require('express'),
	auth = require('express-authentication'),
	basic = require('express-authentication-basic');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const morgan = require('morgan');

var db = require('./db');

if (!process.env.TWILIO_USER) console.log('WARNING: Environment variable TWILIO_USER not set!');
if (!process.env.TWILIO_PW) console.log('WARNING: Environment variable TWILIO_PW not set!');
if (!process.env.ADMIN_USER) console.log('WARNING: Environment variable ADMIN_USER not set!');
if (!process.env.ADMIN_PW) console.log('WARNING: Environment variable ADMIN_PW not set!');

var login = basic(function verify(challenge, callback) {
	if (challenge.username === process.env.TWILIO_USER && challenge.password === process.env.TWILIO_PW) {
		callback(null, true, { user: 'twilio' });
	} else if (challenge.username === process.env.ADMIN_USER && challenge.password === process.env.ADMIN_PW) {
		callback(null, true, { user: 'admin' });
	} else {
		callback(null, false, { error: 'INVALID_PASSWORD' });
	}
});

if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

const corsOptions = {
	credentials: true,
	origin: 'http://localhost:3001'
}

app.use(cors(corsOptions));
app.use(login);

var UsersController = require('./controllers/usersController');
var CodesController = require('./controllers/codesController');
var AttemptsController = require('./controllers/attemptsController');
var HealthController = require('./controllers/healthController');

app.use('/users', auth.required(), UsersController);
app.use('/codes', auth.required(), CodesController);
app.use('/attempts', auth.required(), AttemptsController);
app.use('/health', auth.succeeded(), HealthController);



app.listen(port, () => console.log('sms-game listening on port 3000!'));

module.exports = app
