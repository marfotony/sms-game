

var config = require('./_config');
var mongoose = require('mongoose');

const env = config.mongoURI[process.env.NODE_ENV] || config.mongoURI['development'];

mongoose.connect(env, function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + env);
  }
});