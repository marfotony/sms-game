var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');


var User = require('../models/User');

router.use(bodyParser.json());


router.delete('/', function(req, res) {
	User.updateMany({}, {$set: {score: 0}}, function (error, result) {
		if (error) return res.status(500).json("Error resetting scores " + error);
		
		return res.status(200).json("scores reset");
	});
});

module.exports = router;