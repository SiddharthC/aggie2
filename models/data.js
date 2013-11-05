/**
 * The Data object represents the MongoDB entry for an instance of a tweet or facebook/rss post.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DataSchema = new Schema({
	message: String,
	source: String, //source of the data - could be one of Twitter, Facebook or RSS
	terms: [] //array of search terms
});

/* Enumerating the different data sources */
DataSchema.statics.TWITTER = "TWITTER";
DataSchema.statics.FACEBOOK = "FACEBOOK";
DataSchema.statics.RSS = "RSS";

var Data = mongoose.model("Data", DataSchema);
module.exports = Data;