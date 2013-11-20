var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
	url: String 
});

module.exports = mongoose.model("Feed", FeedSchema);