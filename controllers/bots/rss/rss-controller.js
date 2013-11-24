var FeedParser = require("feedparser");
var request = require("request");
var async = require("async");
var Feed = require("../../../models/rss-feeds.js");
var mongoose = require("mongoose");
var RSSBot = require("./rss-bot.js");


var RssFeedController = {
	/* add a feed to the database */
	addFeed : function(url){
		var feed = new Feed({
			url: url
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

		feed.save(onDataSaved); 
 	},

 	/* search the stored feeds for the given term and return the results */
 	searchFeeds: function(term, onResult){
 		var results = {};
 		results.data = [];

 		/* extract all the registered RSS feed Urls from DB*/
 		Feed.find(function(err, data){
 			if(err){
 				console.error(err);
 				return;
 			}

 			/* make HTTP requests to feed Urls and search for the given term in the title and description */
 			if(data){
 				search(data, term)
 			}
 		});

 		var search = function(data, term){
 			var tasks = [];

 			for(var i = 0; i < data.length; i++){
 				tasks.push((function(index){
 					var f = function(){
 						var rssBot = new RSSBot(data[index].url, term, function(err, result){
 							if(err){
 								console.error(err);
 								return;
 							}else{
 								results.data.push(result);
 							}
 						}, onResult);		
 					};

 					return f;
 				})(i));
 			}

 			/* run the search tasks in parallel and return the results at the end */
 			// async.parallel(tasks, function(error, result){
 			// 	if(error){
 			// 		console.error(error);
 			// 	}
 			// 	onResult(results);
 			// });	

 			// console.log("here");

 			tasks[0]();
 		};
 	}
};

// (function main(){
// 	/* connect to Mongo when the app initializes */
// 	mongoose.connect("mongodb://localhost/aggie");

// 	//RssFeedController.addFeed("http://feeds.bbci.co.uk/news/rss.xml");

// 	setTimeout(function(){
// 		RssFeedController.searchFeeds("Egypt", function(results){
// 			console.log("here");
// 			console.log(results);
// 		});
// 	}, 1000);
// })();

 module.exports = RssFeedController;