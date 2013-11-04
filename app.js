var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Api = require('./controllers/api.js');

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/aggie');

app.configure(function () {							//Admin account init check.
    	User.findOne({username: "admin"}, function(err, result){
		if(err)
			throw err;
		
		if(!result)
		    new User({username: "admin", password: "adminadmin", email: "admin@domain.com", isAdminFlag: "true"}).save(function(err, result){
		    	if(err)
		    		throw err;
		    });
	});

});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));
app.use(express.cookieParser());
app.use(express.session({secret: 'smtc2.0-agggie-seesion-key'}));		//This will loose session when application restarts. To solve put sessions in mongodb 
app.use(app.router);													//moved at end to avoid session error

// Global function for session authentication
var authenticate = function (req, res, next) {
	var isAuthenticated = false;
	if(req.session.username){
		isAuthenticated = true;
	}
	if (isAuthenticated){
		next();
	}
	else {
		console.log("Authentication error");  
	    res.redirect('/login');
	}
};

var authenticateAdmin = function (req, res, next) {
	var isAuthenticated = false;
	if(req.session.username && req.session.isAdminFlag === true)
		isAuthenticated = true;
	if (isAuthenticated)
		next();
	else {
		console.log("Admin verification failed");  
	    res.redirect('/login');
	}
}

/* Redirect to login page */
app.get("/", function(req, res){
	res.redirect('/login');
});

app.get("/register", authenticateAdmin, function(req, res){
	res.sendfile(__dirname + '/views/register.html');
});

app.get("/login", function(req, res){
	res.sendfile(__dirname + '/views/login.html');
	req.session.lastPage = '/login';
});

app.get("/home", authenticate, function(req, res, next){
	res.sendfile(__dirname + '/views/home.html');
});

app.post("/register", authenticateAdmin, function(req, res, next){
	var username = req.param("username", "");
	var password = req.param("password", "");
	var email = req.param("email", "");
	var isAdminFlag = req.param("isAdminFlag","");
	
	if(username == 'Username'){
		res.send("Please input a vaild username");
		return;
	}
	
	//TODO make a regex check for valid email
	if(username == 'mail@address.com'){
		res.send("Please input a vaild email address");
		return;
	}
	
	if(isAdminFlag === "")
		isAdminFlag = false;
	
	User.findOne({email: email}, function(err, result){
		if(err)
			throw err;
		
		if(result)
			res.send("This email id is already registered...\nPlease use Reset Form for password recovery.");
		else
		    new User({username: username, password: password, email: email, isAdminFlag: isAdminFlag}).save(function(err, result){
		    	if(err)
		    		throw err;
		    	
		    	res.send("Successfully Registered");
		    });
	});
});

app.post("/login", function(req, res){
	var username = req.param("username", "");
	var password = req.param("password", "");
	User.findOne({username: username}, function(err, user){
		if(err)
    		throw err;
		
    	user.comparePassword(password, function (err, isMatch){
    		if (err)
    			throw err;
    		
    		if (isMatch){											//check if password match
    			req.session.username = username;					//set session username for the session. Used for authentication.
    			req.session.isAdminFlag = user.isAdminFlag;
    			res.redirect('/home');
    		}
    		else
    			res.send("Login Failed...");
    	});
	});
});

app.listen(9000);
