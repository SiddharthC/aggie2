var express = require("express");
var mongoStore = require("connect-mongo")(express);
var Controller = require('../controllers/api.js');

module.exports = function(app, config){
	app.configure(Controller.configure);

	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.static(config.ROOT_PATH + "/views"));
	app.use(express.cookieParser());

	app.use(express.session({
    	secret: "smtc2.0-agggie-seesion-key",
      	store: new mongoStore({
        	url: config.DATABASE_URL,
        	collection : "aggie_sessions"
      	})
    })); 

	app.use(express.logger());
	app.use(app.router);
};