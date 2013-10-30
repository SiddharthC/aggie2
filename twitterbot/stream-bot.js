var Bot = require("./bot.js");

var bot = new Bot();

/* start a new filter stream searching public tweets for the word "chemical" */
bot.setFilterStream({track: "chemical"});

/* register a listener for tweets */
bot.on("tweet", function(tweet){
	console.log("Received Tweet from stream [" + bot.getStreamName() + "]");
	console.log(tweet.text);
});

