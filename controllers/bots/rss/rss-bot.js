var FeedParser = require("feedparser");
var request = require("request");


var RSSBot = function(url, term, callback, onResult){

	/* Creates a readable stream to the feed URL and searches for the given search term in the feed content */
 	var fetchContent = function(url, callback){
 		var readableStream = request(url);

  		readableStream.pipe(new FeedParser()).on('error', function(error) {
    		callback(error);
    		return;
  		})
  		.on('readable', function () {
			var stream = this, item;
    		while (item = stream.read()) {
    			if((item.title && item.title.search(term) !== -1) || (item.description && item.description.search(term) !== -1)){
    				callback(null, {
    					source: "RSS",
    					url: url,
    					title: item.title
    				});
    			}
    		}
		})
  		.on("end", function(){
  			onResult();
  		});
 	};

 	fetchContent(url, callback);
};

// (function main(){

// 	new RSSBot("http://feeds.bbci.co.uk/news/rss.xml", "Egypt", function(error, results){
// 		if(error){
// 			console.log(error);
// 			return;
// 		}
// 		console.log(results);
// 	});

// })();


 module.exports = RSSBot;