var express = require('express');
var mongoose = require('mongoose');

var User = require('./models/user.js');
var Api = require('./controllers/api.js');
var config = require("./config.js");

var Bot = require("./twitterbot/bot.js");
var Data = require("./models/data.js");

var app = express();

/* connect to Mongo when the app initializes */
mongoose.connect(config.DATABASE_URL);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));
app.use(express.cookieParser());
app.use(express.session({secret: 'smtc2.0-agggie-seesion-key'}));		//This will loose session when application restarts. To solve put sessions in mongodb 
app.use(app.router);
app.use(express.logger());													//moved at end to avoid session error

/* Global function for session authentication */
var authenticate = function (req, res, next) {
	var isAuthenticated = false;
	if(req.session.username){
		isAuthenticated = true;
	}
	if (isAuthenticated){
		next();
	}
	else {
		console.log("Authentication error");  
	    res.redirect('/login');
	}
};

/* Redirect to login page */
app.get("/", function(req, res){
	res.redirect('/login');
});

/* serve the registration page */
app.get("/register", function(req, res){
	res.sendfile(__dirname + '/views/register.html');
});

app.get("/login", function(req, res){
	res.sendfile(__dirname + '/views/login.html');
	req.session.lastPage = '/login';
});

app.get("/home", authenticate, function(req, res, next){
	res.sendfile(__dirname + '/views/home.html');
});

app.post("/register", function(req, res){
	var username = req.param("email", "");
	var password = req.param("password", "");
	
	if(username == 'mail@address.com'){
		res.send("Please input a vaild email address");
		return;
	}
	
	User.findOne({username: username}, function(err, result){
		if(err){
			throw err;
		}
		
		if(result){
			res.send("This email id is already registered...\nPlease use Reset Form for password recovery.");
		}
		else
		    new User({username: username, password: password}).save(function(err, result){
		    	if(err){
		    		throw err;
		    	}
		    	
		    	res.send("Successfully Registered");
		    });
	});
});

app.post("/login", function(req, res){
	var username = req.param("email", "");
	var password = req.param("password", "");
	
	User.findOne({username: username}, function(err, user){
		if(err){
    		throw err;
		}
		
    	user.comparePassword(password, function (err, isMatch){
    		if (err){
    			throw err;
    		}
    		
    		if (isMatch){											//check if password match
    			req.session.username = username;					//set session username for the session. Used for authentication.
    			res.redirect('/home');
    		}
    		else{
    			res.send("Login Failed...");
    		}
    	});
	});
});

/* Handle request to start a crawler */
app.post("/start-crawler", function(req, res){
	var source = req.param("source", null);
	if(!source){
		res.send("source cannot be empty");
	}
	var term = req.param("search-term", null);
	if(!term){
		res.send("search-term cannot be empty");
	}

	startTwitterBot(term);

});

/* Handle GET request for feed */
app.get("/feed", function(req, res){
	/* Current implementation is to simply return top 5 entries of the database */
	Data.find(function(err, data){
		if(err){
			console.log("Could not fetch data");
			console.err(err);
		}else{
			console.log(data);
		}
	});
});

/* start a new Twitter bot with the given search term */
var startTwitterBot = function(searchTerm){
	var bot = new Bot();

	/* start a new filter stream searching public tweets for the word "chemical" */
	bot.setFilterStream({track: searchTerm});

	var tweetHandler = function(tweet){
		console.log("Received Tweet from stream [" + bot.getStreamName() + "]");
		console.log(tweet.text);

		var data = new Data({message: tweet.text, source: Data.TWITTER, terms: [searchTerm]});

		var onDataSaved = function(err, result){
			if(err){
				console.log("data could not be saved");
				console.err(err);
			}else{
				console.log(result);
			}
		};

		data.save(onDataSaved);	
	};

	/* register a listener for tweets */
	bot.on("tweet", tweetHandler);
};

app.listen(config.SERVER_PORT);