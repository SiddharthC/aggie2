var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    	email: String,
    	password: String
});

var userSchemaObj = mongoose.Schema({
	email: String,
	password: String,
	_id: mongoose.Schema.ObjectId
});

module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("UserObj", userSchemaObj);


