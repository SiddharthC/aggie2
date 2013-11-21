var Bot = require("./twitter-bot.js");
var Data = require("../../../models/data.js");

var TwitterBotController = {

/**
 * start a new Twitter bot with the given search term
 * @return reference to the Bot object
 */
startTwitterBot : function(searchTerm) {
	var bot = new Bot();

	/* start a new filter stream searching public tweets for the searchTerm */
	bot.setFilterStream({
		track: searchTerm
	});

	var tweetHandler = function(tweet) {
		var data = new Data({
			message: tweet.text,
			source: Data.TWITTER,
			user_name: tweet.user.name,
			user_handle: tweet.user.screen_name,
			user_image_url: tweet.user.profile_image_url,
			timestamp: tweet.created_at,
			terms: [searchTerm]
		});

		/**
		 * Callback executed on save of data. At this point it only logs if there is an error.
		 */
		var onDataSaved = function(err, result) {
			if (err) {
				console.log("data could not be saved");
				console.err(err);
			}
		};

		data.save(onDataSaved);
	};

	/* register a listener for tweets */
	bot.on("tweet", tweetHandler);
	return bot;
}

};

/* Test main function */
// (function main(){
// 	TwitterBotController.startTwitterBot("Hyderabad");
// })();

module.exports = TwitterBotController;