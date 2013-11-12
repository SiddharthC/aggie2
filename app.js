var express = require('express');
var mongoose = require('mongoose');

var config = require("./config.js");

var User = require('./models/user.js');
var Controller = require('./controllers/api.js');
var _ = require("underscore");

var app = express();

/* connect to Mongo when the app initializes */
mongoose.connect(config.DATABASE_URL);

app.configure(Controller.configure);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/views'));
app.use(express.cookieParser());
app.use(express.session({
	secret: 'smtc2.0-agggie-seesion-key'
})); //This will loose session when application restarts. To solve put sessions in mongodb 
app.use(express.logger());
app.use(app.router); //moved at end to avoid session error

/* Global controller object*/
var controller = {
	bots: [],

	/**
	 * search bots by id
	 */
	search: function(id){
		if(this.bots.length === 0){
			return null;
		}

		for(var i = 0; i < this.bots.length; i++){
			if(this.bots[i].id === id){
				return this.bots[i];
			}
		}
	}
};

/* Redirect to login page */
app.get("/", function(req, res) {
	res.redirect("/login");
});


/* serve the registration page */
app.get("/register", Controller.helper.authenticateAdmin, Controller.registerPage);
app.get("/login", Controller.loginPage);
app.get("/home", Controller.helper.authenticate, Controller.home);
app.get("/start-crawler", Controller.helper.authenticate, Controller.startBot);
app.post("/register", Controller.helper.authenticateAdmin, Controller.register);
app.post("/login", Controller.login);


/* Handle request to start a crawler */
app.post("/start-twitter-bot", _.bind(Controller.startTwitterBot, {controller : controller}));
app.post("/stop-twitter-bot", _.bind(Controller.stopTwitterBot, {controller: controller}));

/* Handle GET request for feed */
app.get("/feed", Controller.feed);

app.listen(config.SERVER_PORT);