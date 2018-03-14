var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');


var Code = require('../models/Code');

router.use(bodyParser.json());


router.get('/', function(req, res) {
	Code.find({}, function(err, codes) {
		if (err) return res.status(500).json("Error getting codes: " + err);

		res.status(200).json(codes);
	});
});

router.get('/:id', function(req, res) {
	Code.findById(req.params.id, function(err, code) {
		if(err) return res.status(500).json('Error getting code: ' + err);
		if (!code) return res.status(404).json('Code not found with id: ' + req.params.id);

		res.status(200).send(code);
	});
});

router.post('/', function(req, res) {
	Code.create({ code: req.body.code, activatesAt: req.body.activatesAt, expiresAt: req.body.expiresAt }, function(err, code) {
		if (err) return res.status(500).send("Error creating code: " + err);

		res.status(201).send(code);
	});
});

router.put('/:id', function(req, res) {
	Code.findOneAndUpdate(req.params.id, req.body)
		.exec(function(err, code) {
			if (err) return res.status(500).json("Error updating code: " + err);

			res.sendStatus(204);
		});
});

router.delete('/:id', function(req, res) {
	Code.findOneAndRemove({ _id: req.params.id }, function (err, code) {
		if (err) return res.status(500).json("Error deleting code: " + err);
		if (!code) return res.status(404).json("Code not found with id: " + req.params.id);

		res.sendStatus(204);
	});
});


module.exports = router;
