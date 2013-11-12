var User = require('../models/user.js');
var Data = require("../models/data.js");
var TwitterBotController = require("./bots/twitterbot/twitter-bot-controller.js");

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

var Controller = {

	/* Current implementation is to simply return top 10 most recent results from the Data collection */
	feed : function(req, res) {
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
		this.controller.bots.push(bot);

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

		var bot = this.controller.search(botId);
		if(!bot){
			res.send("No bot with id [" + botId + "] exists.");
			return;
		}

		bot.stop();
		console.log("Bot stopped");
		res.send("Bot successfully stopped");
	}	

};

module.exports = Controller;