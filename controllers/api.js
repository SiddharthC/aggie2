var User = require('../models/user.js');
//var UserObj = require('../models/user.js');

exports.createUser = function(req, res) {
	var email = req.param("email", "");
	var password = req.param("password", "");
    new User({email: email, password: password}).save();
}

exports.authenticate_user = function(req, res){
	
	//temp =  TODO
	var email = req.param("email", "");
	console.log("The email is " + email);
	var password = req.param("password", "");
	console.log("The password is " + password);
	
	console.log("In authenticate user ");
	
//	var temp = User({email: email, password: password}).find({email: email, password: password }, { _id: 1});
//	//var temp = new User({email: email, password: password}).find();
//	console.log(temp);
//	
	
	
}