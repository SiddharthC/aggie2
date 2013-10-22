var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Api = require('./controllers/api.js');

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

app.get("/login", function(req, res){
	res.sendfile(__dirname + '/views/login.html');
});

app.get("/home", function(req, res){							//Remember to remove it. TODO
	res.sendfile(__dirname + '/views/home.html');
});

app.post("/register", function(req, res){
	var email = req.param("email", "");
	var password = req.param("password", "");
	
	if(email == 'mail@address.com'){
		res.send("Please input a vaild email address");
		return;
	}
	
	User.find({email: email}, {_id: 1}, function(err, result){
		if(err){
    		console.error(temp);
    	}else{
    		if(result[0])
    			res.send("This email id is already registered...\nPlease use Reset Form for password recovery.");
    		else
    		    new User({email: email, password: password}).save(function(err, user){
    		    	if(err){
    		    		console.error(err);
    		    	}else{
    		    		res.send("Successfully Registered");
    		    		console.log("User Created");
    		    	}
    		    });
    	}
	});
});

app.post("/login_check", function(req, res){
	var email = req.param("email", "");
	console.log("The email is " + email);
	var password = req.param("password", "");
	console.log("The password is " + password);
	User.find({email: email, password: password }, {_id: 1}, function(err, result){
		if(err){
    		console.error(temp);
    	}else{
    		if(result[0])
    			res.sendfile(__dirname + '/views/home.html');
    		else
    			res.send("Login Failed...");
    	}
	});
});

app.listen(9000);