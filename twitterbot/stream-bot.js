var Bot = require("./bot.js");
var Data = require("../models/data.js");
var mongoose = require("mongoose");

var bot = new Bot();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/aggie');

/* start a new filter stream searching public tweets for the word "chemical" */
bot.setFilterStream({track: "chemical"});

var tweetHandler = function(tweet){
	console.log("Received Tweet from stream [" + bot.getStreamName() + "]");
	console.log(tweet.text);

	var data = new Data({message: tweet.text, source: Data.TWITTER, terms: ["chemical"]});

	var onDataSaved = function(err, result){
		if(err){
			console.log("data could not be saved");
			console.err(err);
		}else{
			console.log(result);
		}
	};

	data.save(onDataSaved);	
};

/* register a listener for tweets */
bot.on("tweet", tweetHandler);



