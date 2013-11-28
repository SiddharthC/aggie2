config = { };

config.mongo = {
	SERVER_PORT: 9000,
	DATABASE_URL: "mongodb://localhost/aggie"
};

config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:9000/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '452708194838351',
    appSecret:      process.env.FACEBOOK_APPSECRET      || 'b14ea9259125c1124aaa4bb5ea5c1a85',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'Aggie',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;