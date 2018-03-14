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

router.get('/:id', function(req, res) {
	User.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).json("Error getting user: " + err);
		if (!user) return res.status(404).json("User not found with id: " + req.params.id);

		res.status(200).json(user);
	});
});

router.post('/', function(req, res) {
	User.create({ phoneNumber: req.body.phoneNumber, username: req.body.username }, function(err, user) {
		if (err) return res.status(500).json("Error creating user: " + err);

		res.status(201).json(user);
	});
});

router.put('/:id', function(req, res) {
	User.findOneAndUpdate({ _id: req.params.id }, req.body)
		.exec(function(err, user) {
			if (err) return res.status(500).json("Error updating user: " + err);

			res.sendStatus(204);
		});

});

router.delete('/:id', function(req, res) {
	User.findOneAndRemove({ _id: req.params.id }, function (err, user) {
		if (err) return res.status(500).json("Error deleting user: " + err);
		if (!user) return res.status(404).json("User not found with id: " + req.params.id);

		res.sendStatus(204);
	});
});

module.exports = router;