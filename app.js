var express = require('express');
var mongoose = require('mongoose');

var config = require("./config/config.js");

var Controller = require('./controllers/api.js');
var _ = require("underscore");

var app = express();

/* connect to Mongo when the app initializes */
mongoose.connect(config.DATABASE_URL);

/* Bootstrap express */
require("./config/express.js")(app, config);

/* Redirect to login page */
app.get("/", function(req, res) {
	res.redirect("/login");
});


/* serve the registration page */
app.get("/register", Controller.helper.authenticateAdmin, Controller.registerPage);
app.get("/login", Controller.loginPage);
app.get("/home", Controller.helper.authenticate, Controller.home);
app.post("/register", Controller.helper.authenticateAdmin, Controller.register);
app.post("/login", Controller.login);


/* Twitter API */
app.get("/twitter-bot-page", Controller.helper.authenticate, Controller.renderBotPage);
app.post("/start-twitter-bot", _.bind(Controller.startTwitterBot, {bot_controller: Controller.bot_controller}));
app.post("/stop-twitter-bot", _.bind(Controller.stopTwitterBot, {bot_controller: Controller.bot_controller}));

/* RSS API */
app.post("/add-feed-url", Controller.addFeedUrl);
app.get("/search-rss-feed", Controller.searchRssFeed);

/* Handle GET request for feed */
app.get("/feed", Controller.feed);

app.listen(config.SERVER_PORT);