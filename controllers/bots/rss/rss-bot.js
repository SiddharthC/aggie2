var FeedParser = require("feedparser");
var request = require("request");
var async = require("async");
var Feed = require("../../../models/rss-feeds.js");


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
 	searchFeeds: function(term){
 		var results = {};
 		results.data = [];

 		/* extract all the registered RSS feed Urls from DB*/
 		Feed.find(function(err, data){
 			if(err){
 				console.error(err);
 				return [];
 			}

 			/* make HTTP requests to feed Urls and search for the given term in the title and description */
 			if(data){
 				search(data, term)
 			}
 		});

 		var search = function(urls, term){
 			var tasks = {};
 			
 			for(var i = 0; i < urls.length; i++){
 				tasks["" + (i + 1)] = function(callback){
 					fetchContent(urls[i], callback);		
 				};
 			}

 			/* run the search tasks in parallel and return the results at the end */
 			async.parallel(tasks, function(error, result){
 				if(error){
 					console.error(error);
 				}
 				return results;
 			});	
 		};

 		/* Creates a readable stream to the feed URL and searches for the given search term in the feed content */
 		var fetchContent = function(url, callback){
 			request(url).pipe(new FeedParser())
  					.on('error', function(error) {
    					callback(error);
    					return;
  					})
  					.on('readable', function () {
						var stream = this, item;
    					while (item = stream.read()) {
    						if((item.title && item.title.search(term) !== -1) || (item.description && item.description.search(term) !== -1)){
    							results.data.push({
    								source: "RSS",
    								url: url,
    								title: item.title
    							});
    						}
    					}
    					callback(true);
					});
 		};
 	}
};

 module.exports = RssFeedController;