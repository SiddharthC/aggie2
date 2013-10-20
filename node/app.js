var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user.js');

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/aggie');

app.configure(function () {
    
});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/views'));

app.get("/", function(req, res){
  res.send("Aggie 2.0");
});

app.get("/register", function(req, res){
	res.sendfile(__dirname + '/views/register.html');
});

app.post("/register", function(req, res){
	var email = req.param("email", "");
	var password = req.param("password", "");
    new User({email: email, password: password}).save(function(err, user){
    	if(err){
    		console.err(err);
    	}else{
    		res.send("Successfully Registered");
    	}
    });
});

app.listen(9000);