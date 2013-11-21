var path = require("path");

module.exports = {
	SERVER_PORT: 9000,
	DATABASE_URL: "mongodb://localhost/aggie",

	ROOT_PATH: path.normalize(__dirname + "/..")
};