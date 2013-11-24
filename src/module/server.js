var xmpp = require('node-xmpp');
var User = require('./user');
var Router = require('./router');
var http = require('http')
var connect = require('connect');
var path = require('path')

var Server = function(config){
    this.config = config;
    this.c2sServer = new xmpp.C2SServer(config);
    this._initRouter(); //init xmpp-server's Router
    this._initAuth(this.c2sServer);   //init login and register
    this._initBoshServer();
};

Server.prototype._register = function(client){
    client.on("register", function (opts, cb) {
        console.log('register',opts.jid,'->',opts.password);
        User.register(opts.jid,opts.passowrd,function(error,success){
            if(error){
                cb(error);
            }else {
                cb();
            }
        });
    });
};

Server.prototype._auth = function(client){
    client.on("authenticate", function (opts, cb) {
        console.log("AUTH:" + opts.jid + " -> " + opts.password);
        User.auth(opts.jid,opts.password,function(error,success){
            if(error){
                cb(error);
            }else {
                cb();
            }

        });
    });
};

Server.prototype._initAuth = function(server){
    var self = this;
    server.on('connect',function(client){
        self._register(client);
        self._auth(client);
    });
};

Server.prototype._initRouter = function(){
    Router.configure(this.c2sServer);
    this.router = this.c2sServer.router;
};

Server.prototype._initBoshServer = function(){
    var self = this;
    var sv = this.boshServer = new xmpp.BOSHServer();

    var app = connect();
    app.use(connect.static(path.resolve(__dirname,'../../')));
    app.use(function (req, res, next) {
        sv.handleHTTP(req, res);
    });

    http.createServer(app).listen(this.config.boshPort);
    this._initAuth(sv);

    sv.on('connect', function(svcl_) {
        c2s = new xmpp.C2SStream({ connection: svcl_ });
        self._register(c2s);
        self._auth(c2s);
    });
};
module.exports = Server;
