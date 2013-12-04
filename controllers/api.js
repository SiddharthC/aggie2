var User = require('../models/user.js');
var Data = require("../models/data.js");
var TwitterBotController = require("./bots/twitterbot/twitter-bot-controller.js");
var RssFeedController = require("./bots/rss/rss-controller.js");
var ChartController = require("./chart-controller.js");
var Feed = require("../models/rss-feeds.js");
var nodemailer = require('nodemailer');

exports.createUser = function(req, res) {
	var email = req.param("email", "");
	var password = req.param("password", "");
    new User({email: email, password: password}).save();
};

exports.authenticate_user = function(req, res){
	
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
    		console.log(result[0]["_id"]);
    	}
	});
};

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "aggie.node@gmail.com",
		pass: "freeNfair"
	}
});

var Controller = {
	bot_controller: {
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
	},

	helper : {
		authenticate : function(req, res, next) {
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
		},

		authenticateAdmin : function(req, res, next) {
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
	},

	configure : function() { //Admin account init check.
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
	},
	
	loginPage : function(req, res) {
		res.sendfile("login.html", {root: "./views/"});
		req.session.lastPage = '/login';
	},

	home : function(req, res, next) {
		res.sendfile("messages.html", {root: "./views/"});
	},

	renderBotPage : function(req, res, next) {
		res.sendfile("start-crawler.html", {root: "./views/"});
	},

	registerPage : function(req, res) {
		res.sendfile("register.html", {root: "./views/"});
		req.session.lastPage = '/login';
	},

	register : function(req, res, next) {
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
					};

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
	},

	login : function(req, res) {
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
	},

	/* Current implementation is to simply return top 10 most recent results from the Data collection */
	feed : function(req, res) {
		var _id = req.param("_id", null);

		if(_id){
			Data.find({_id : {$gt : _id}}, function(err, data) {
				if (err) {
					console.log("Could not fetch data");
					console.error(err);
				} else {
					if(data){
						if(data.length <= 10){
							res.send(data);
							return;
						}
						res.send(data.slice(data.length - 9, data.length));
					}	
				}
			});	
		}else{
			Data.find(function(err, data) {
				if (err) {
					console.log("Could not fetch data");
					console.err(err);
				} else {
					if(data){
						if(data.length <= 10){
							res.send(data);
							return;
						}
						res.send(data.slice(data.length - 9, data.length));
					}	
				}
			});		
		}
		
	},

	logout: function(req, res){
		req.session.destroy();
		res.status(302).redirect("/login");
	},

	startTwitterBot : function(req, res) {
		var source = req.param("source", null);
		if (!source) {
			res.send("source cannot be empty");
			return;
		}
		
		var term = req.param("searchTerm", null);
		if (!term) {
			res.send("search-term cannot be empty");
			return;
		}

		/* Start a Twitter search bot and store it in the controller */
		var bot = TwitterBotController.startTwitterBot(term);
		//console.log(this);
		this.bot_controller.bots.push(bot);

		/* send the bot ID back to the front end */
		res.send({
			id: bot.id
		});

	},

	stopTwitterBot : function(req, res){
		var botId = req.param("id", null);
		if(!botId){
			res.send("id cannot be empty");	
			return;
		}

		var bot = this.bot_controller.search(botId);
		if(!bot){
			res.send("No bot with id [" + botId + "] exists.");
			return;
		}

		bot.stop();
		console.log("Bot stopped");
		res.send("Bot successfully stopped");
	},

	addFeedUrl : function(req, res){
		var feedUrl = req.param("feedUrl", null);
		if(!feedUrl){
			res.send("feedUrl cannot be empty");
			return;
		}

		RssFeedController.addFeed(feedUrl);
		res.send({
			msg: feedUrl + " successfully added to DB"
		});
	},

	searchRssFeed : function(req, res){
		var term = req.param("term", null);
		if(!term){
			res.send("term cannot be empty");
			return;
		}

		RssFeedController.searchFeeds(term, function(results){
			res.send(results);
		});
	
	},

	getChartData: function(req, res){
		ChartController.getCurrentData(function(results){
			console.log(results);
			res.send(results);
		});
	}	

};

module.exports = Controller;