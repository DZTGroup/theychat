var xmpp = require("node-xmpp");
var config = require('./cfg');

var Server = require('./module/server');


var server = new Server(config);

