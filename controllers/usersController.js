var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');


var User = require('../models/User');

router.use(bodyParser.json());


router.get('/', function(req, res) {
	User.find({}, function(err, users) {
		if (err) return res.status(500).json("Error getting users: " + err);

		res.status(200).json(users);
	});
});

router.get('/:phoneNumber', function(req, res) {
	User.findOne({ phoneNumber: req.params.phoneNumber}, function (err, user) {
		if (err) return res.status(500).json("Error getting user: " + err);
		if (!user) return res.status(404).json("User not found with phoneNumber: " + req.params.phoneNumber);

		res.status(200).json(user);
	});
});

router.post('/', function(req, res) {
	User.create({ phoneNumber: req.body.phoneNumber, username: req.body.username }, function(err, user) {
		if (err) {		
			if (err.name === 'ValidationError') {
				if (err.errors.phoneNumber.kind === 'required') return res.status(400).json("Error creating user: phoneNumber is required");
			}
			else if (err.name === 'BulkWriteError') return res.status(409).json(err.errmsg);

			else return res.status(500).json("Error creating user: " + err);
		}

		res.status(201).json(user);
	});
});

router.put('/:phoneNumber', function(req, res) {
	User.findOneAndUpdate({ phoneNumber: req.params.phoneNumber }, req.body)
		.exec(function(err, user) {
			if (err) return res.status(500).json("Error updating user: " + err);

			res.sendStatus(204);
		});

});

router.delete('/:phoneNumber', function(req, res) {
	User.findOneAndRemove({ phoneNumber: req.params.phoneNumber }, function (err, user) {
		if (err) return res.status(500).json("Error deleting user: " + err);
		if (!user) return res.status(404).json("User not found with phoneNumber: " + req.params.phoneNumber);

		res.sendStatus(204);
	});
});

module.exports = router;