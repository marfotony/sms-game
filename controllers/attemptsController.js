var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');


var Attempt = require('../models/Attempt');
var Code = require('../models/Code');
var User = require('../models/User');

router.use(bodyParser.json());

router.get('/', function(req, res) {
	Attempt.find({}, function(err, attempt) {
		if (err) return res.status(500).json("Error getting attempt: " + err);

		res.status(200).json(attempt);
	});
});

router.get('/:id', function(req, res) {
	Attempt.findById(req.params.id, function (err, attempt) {
		if (err) return res.status(500).json("Error getting attempt: " + err);
		if (!attempt) return res.status(404).json("Attempt not found with id: " + req.params.id);

		res.status(200).json(attempt);
	});
});

router.post('/', function(req, res) {
	User.findOne({
		phoneNumber: req.body.phoneNumber
	}, function (err, user) {
		if (err) return res.status(500).json("Error matching attempt to user: " + err);
		else if (user == null || user.length < 1) return res.status(404).json("User must exist to create attempt. No user found with phoneNumber: " + req.body.phoneNumber);

		currentTime = new Date();
		cooldownTime = new Date(currentTime.getTime() - 15 * 60000);
		Attempt.find({
			phoneNumber: req.body.phoneNumber,
			createdAt: { $gt: cooldownTime }
		}, function(err, attempt) {
			if (attempt !== null && attempt.length > 0) return res.status(200).json("User has submitted code in the past 15 minutes. Ignoring this request.");
			else {
				Attempt.create({ code: req.body.code, phoneNumber: req.body.phoneNumber }, function(err, attempt) {
						if (err) {
							if (err.name === 'ValidationError') {
								if (err.errors.phoneNumber.kind === 'required') return res.status(400).json("Error creating attempt: phoneNumber is required");
								if (err.errors.code.kind === 'required') return res.status(400).json("Error creating attempt: code is required");
							}
							
							else return res.status(500).json("Error creating attempt: " + err);
						}
						else {
							Code.find({ 
								activatesAt: { $lt: Date(attempt.createdAt) },
								expiresAt: { $gt: Date(attempt.createdAt) },
								code: attempt.code
							}, function(err, codes) {
								if (err) return res.status(500).json("Error matching attempt to code: " + err);
								if (codes.length > 0) {
									attempt.success = true;
									attempt.save();

									user.score = user.score + 1;
									user.save();

									res.status(201).json(attempt);
								}
								else {
									res.status(201).json(attempt);
								}
							});
						}
				});				
			}
		});
	});
});

router.put('/:id', function(req, res) {
	Attempt.findOneAndUpdate({ _id: req.params.id }, req.body)
		.exec(function(err, attempt) {
			if (err) return res.status(500).json("Error updating attempt: " + err);

			res.sendStatus(204);
		});
});

router.delete('/:id', function(req, res) {
	Attempt.findOneAndRemove({ _id: req.params.id }, function (err, attempt) {
		if (err) return res.status(500).json("Error deleting attempt: " + err);
		if (!attempt) return res.status(404).json("Attempt not found with id: " + req.params.id);

		res.sendStatus(204);
	});
});


module.exports = router;