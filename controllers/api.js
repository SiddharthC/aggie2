var User = require('../models/user.js');
//var UserObj = require('../models/user.js');

exports.createUser = function(req, res) {
	var email = req.param("email", "");
	var password = req.param("password", "");
    new User({email: email, password: password}).save();
}

exports.authenticate_user = function(req, res){
	
	var email = req.param("email", "");
	console.log("The email is " + email);
	var password = req.param("password", "");
	console.log("The password is " + password);
	User.find({email: email, password: password }, {_id: 1}, function(err, result){
		if(err){
    		console.error(temp);
    	}else{
    		if(result[0])
    			res.sendfile(__dirname + '/views/home.html');
    		else
    			res.send("Login Failed...");
    		console.log(result[0]["_id"]);
    	}
	});
	
	
}