var express = require('express');
var mongoose = require('mongoose');

var config = require("./config.js");

var User = require('./models/user.js');
var Controller = require('./controllers/api.js');

var nodemailer = require('nodemailer');
var _ = require("underscore");

var app = express();

/* connect to Mongo when the app initializes */
mongoose.connect(config.DATABASE_URL);

app.configure(function() { //Admin account init check.
	User.findOne({
		username: "admin"
	}, function(err, result) {
		if (err) {
			throw err;
		}

		if (!result) {
			new User({
				username: "admin",
				password: "adminadmin",
				email: "admin@domain.com",
				isAdminFlag: "true"
			}).save(function(err, result) {
				if (err) {
					throw err;
				}
			});
		}
	});

});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));
app.use(express.cookieParser());
app.use(express.session({
	secret: 'smtc2.0-agggie-seesion-key'
})); //This will loose session when application restarts. To solve put sessions in mongodb 
app.use(express.logger());
app.use(app.router); //moved at end to avoid session error

/* Global controller object*/
var controller = {
	bots: [],

	/**
	 * search bots by id
	 */
	search: function(id){
		if(this.bots.length === 0){
			return null;
		}

		for(var i = 0; i < this.bots.length; i++){
			if(this.bots[i].id === id){
				return this.bots[i];
			}
		}
	}
};

/* Global function for session authentication */
var authenticate = function(req, res, next) {
	var isAuthenticated = false;
	if (req.session.username) {
		isAuthenticated = true;
	}
	if (isAuthenticated) {
		next();
	} else {
		console.log("Authentication error");
		res.redirect('/login');
	}
};

var authenticateAdmin = function(req, res, next) {
	var isAuthenticated = false;
	if (req.session.username && req.session.isAdminFlag === true)
		isAuthenticated = true;
	if (isAuthenticated)
		next();
	else {
		console.log("Admin verification failed");
		res.redirect('/login');
	}
}

/* Redirect to login page */
app.get("/", function(req, res) {
	res.redirect('/login');
});


/* serve the registration page */
app.get("/register", authenticateAdmin, function(req, res) {
	res.sendfile(__dirname + '/views/register.html');
	req.session.lastPage = '/login';
});

app.get("/login", function(req, res) {
	res.sendfile(__dirname + '/views/login.html');
	req.session.lastPage = '/login';
});

app.get("/home", authenticate, function(req, res, next) {
	res.sendfile(__dirname + '/views/home.html');
});

app.get("/start-crawler", authenticate, function(req, res, next) {
	res.sendfile(__dirname + '/views/start-crawler.html');
	//res.send("Test");
});

app.post("/register", authenticateAdmin, function(req, res, next) {
	var username = req.param("username", "");
	var password = req.param("password", "");
	var email = req.param("email", "");
	var isAdminFlag = req.param("isAdminFlag", "");

	if (username == 'Username') {
		res.send("Please input a vaild username");
		return;
	}

	//TODO make a regex check for valid email
	if (username == 'mail@address.com') {
		res.send("Please input a vaild email address");
		return;
	}

	if (isAdminFlag === "") {
		isAdminFlag = false;
	}

	User.findOne({
		email: email
	}, function(err, result) {
		if (err) {
			throw err;
		}

		if (result) {
			res.send("This email id is already registered...\nPlease use Reset Form for password recovery.");
		} else {
			new User({
				username: username,
				password: password,
				email: email,
				isAdminFlag: isAdminFlag
			}).save(function(err, result) {
				if (err) {
					throw err;
				}

				// setup e-mail data with unicode symbols
				var mailOptions = {
					from: "Aggie 2.0 Dev Team <aggie.node@gmail.com>", // sender address
					to: email, // list of receivers
					subject: "Hello World", // Subject line
					text: "Hello world", // plaintext body
					html: "<b>Hello world.</b>" // html body
				}

				// send mail with defined transport object
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						console.log("Invalid Email: " + error);
						res.redirect('/register');
					}
					//smtpTransport.close(); // shut down the connection pool, no more messages
				});

				res.send("Please verify through the email received.");
			});
		}
	});
});


app.post("/login", function(req, res) {
	var username = req.param("username", "");
	var password = req.param("password", "");
	User.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			throw err;
		}
		if (user) {

			user.comparePassword(password, function(err, isMatch) {
				if (err) {
					throw err;
				}

				if (isMatch) { //check if password match
					req.session.username = username; //set session username for the session. Used for authentication.
					req.session.isAdminFlag = user.isAdminFlag;
					res.redirect('/home');
				} else {
					res.redirect('/login');
				}
			});
		} else {
			res.redirect('/login');
		}
	});
});


/* Handle request to start a crawler */
app.post("/start-twitter-bot", _.bind(Controller.startTwitterBot, {controller : controller}));
app.post("/stop-twitter-bot", _.bind(Controller.stopTwitterBot, {controller: controller}));

/* Handle GET request for feed */
app.get("/feed", Controller.feed);


var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "aggie.node@gmail.com",
		pass: "freeNfair"
	}
});

app.listen(config.SERVER_PORT);