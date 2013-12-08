var express = require('express');
var mongoose = require('mongoose');

var config = require("./config/config.js");

var AggieController = require('./controllers/aggie.js');
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


/* serving pages */
app.get("/register", AggieController.helper.authenticateAdmin, AggieController.registerPage);
app.get("/login", AggieController.loginPage);
app.get("/home", AggieController.helper.authenticate, AggieController.home);

/* register and login/logout functionality */
app.post("/register", AggieController.helper.authenticateAdmin, AggieController.register);
app.post("/login", AggieController.login);
app.post("/logout", AggieController.logout);


/* Twitter API */
app.get("/twitter-bot-page", AggieController.helper.authenticate, AggieController.renderBotPage);
app.post("/start-twitter-bot", _.bind(AggieController.startTwitterBot, {bot_controller: AggieController.bot_controller}));
app.post("/stop-twitter-bot", _.bind(AggieController.stopTwitterBot, {bot_controller: AggieController.bot_controller}));

/* RSS API */
app.post("/add-feed-url", AggieController.addFeedUrl);
app.get("/search-rss-feed", AggieController.searchRssFeed);

/* Handle GET request for feed */
app.get("/feed", AggieController.feed);

/* Get analytics data */
app.get("/trends", AggieController.getChartData);

app.listen(config.SERVER_PORT);
console.log("Aggie 2.0 is up and running on port =====> " + config.SERVER_PORT);