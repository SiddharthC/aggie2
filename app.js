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
	var username = req.param("email", "");
	var password = req.param("password", "");
	
	if(username == 'mail@address.com'){
		res.send("Please input a vaild email address");
		return;
	}
	
	User.findOne({username: username}, function(err, result){
		if(err)
			throw err;
		
		if(result)
			res.send("This email id is already registered...\nPlease use Reset Form for password recovery.");
		else
		    new User({username: username, password: password}).save(function(err, result){
		    	if(err)
		    		throw err;
		    	
		    	res.send("Successfully Registered");
		    	console.log("User Created");
		    });
	});
});

app.post("/login_check", function(req, res){
	var username = req.param("email", "");
	console.log("The email is " + username);
	var password = req.param("password", "");
	console.log("The password is " + password);
	User.findOne({username: username}, function(err, user){
		if(err)
    		throw err;
		
    	user.comparePassword(password, function (err, isMatch){
    		if (err)
    			throw err;
    		
    		if (isMatch)											//check if password match
    			res.sendfile(__dirname + '/views/home.html');
    		else
    			res.send("Login Failed...");
    	});
	});
});

app.listen(9000);