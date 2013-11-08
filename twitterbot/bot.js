/* Importing the Twit module */
var Twit = require("twit");
var uuid = require("node-uuid");

var Bot = module.exports = function() {
	/* Load the Aggie2.0 Twitter Account configuration object */
	var config = require("./config.js");
	this.id = uuid.v1();
	this.twit = new Twit(config);
};

/* Maximum length of tweet */
Bot.prototype.MAX_TWEET_LENGTH = 140;

/**
 * Post a tweet
 * @param status the status to post
 * @param callback the callback to execute after posting tweet
 */
Bot.prototype.tweet = function(status, callback) {
	if (status.length > this.MAX_TWEET_LENGTH) {
		return callback(new Error("tweet is too long: " + status.length));
	}
	this.twit.post("statuses/update", {
		status: status
	}, callback);
};

Bot.prototype.setFilterStream = function(options) {
	this.streamName = "statuses/filter";
	this.stream = this.twit.stream(this.streamName, options);
};

Bot.prototype.getStreamName = function() {
	return this.streamName;
};

Bot.prototype.on = function(event, callback) {
	this.stream.on(event, callback);
};

Bot.prototype.stop = function(){
	this.stream.stop();
};