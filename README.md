Installing Aggie-2.0

1) Install node.js on the system. Check out http://nodejs.org/download/ to download an installer/source
2) Install MongoDB which serves as the primary database for the system. http://www.mongodb.org/downloads
3) Download the Aggie-2.0 project source from Github => https://github.com/alexstelea/Aggie2.0
4) Create a data directory for MongoDB with the structure /data/db/
5) Start MongoDB server instance by running $ mongod --dbpath=”path-to/data/db/”
6) Go to the project folder (the one that contains app.js & package.json) and run npm install
7) Run node app.js
8) Open a browser and go to http://localhost:9000 to check if the login screen comes up.
9) Use the admin credentials {admin:adminadmin} to login.
10) New Tweet Bots can be started by typing in search terms in the input box on the top right corner and the result can be observed in the live feed.

Understanding the Code

This section provides an overview of the implementation of Aggie-2.0 platform. The primary technologies used in the implementation are
	
	1) Node.js - which provides the basic framework for all the search bots (Twitter, RSS and Facebook) and for the web front end.
	2) Express - the web framework we used to provide a REST API for Aggie-2.0
	3) MongoDB/Mongoose - provided the database to store feed from various data sources.
	4) Twit - javascript wrappers over Twitter API
	5) Feedparser - node.js module to parse RSS feeds
	6) Bootstrap 3.0 - the UI framework used on the front end
	7) jQuery - UI library used on the web front end which provides functionality for dynamic HTML insertion and making AJAX calls to the server.

We have also used a number of Node.js modules/libraries to assist us in various book-keeping operations like login/session management and password encryption.

[Code Structure]

./app.js : This is the primary script that begins the Aggie-2.0 web service by connecting it to the MongoDB database (URL specified in ./config/config.js) and exposing a set of routes that can be queried by a HTTP client.

./package.json : This file contains all the dependencies of Aggie-2.0.

./controllers/aggie.js : Contains all the core functionality of Aggie. Most of this functionality is exposed as REST API in ./app.js
./controllers/chart-controller.js : Contains functionality to extract analytics data from the database
./controllers/bots/twitterbot/twitter-bot-controller.js : Contains methods to start and stop keyword searches on Twitter
./controllers/bots/rss/rss-controller.js : Wrapper over the node library - Feedparser to crawl RSS feed for specific search terms

./models/data.js : Data model for data feeds
./models/user.js : Data model for users - contains built in methods for password encryption

./views/ : This folder contains all the static content like HTML markup, CSS stylesheets and client side JavaScript.

./config/config.js : Contains all the configuration settings for the application such as Database URL and server port number.
./config/express.js : Bootstrapping code for the Express server.





