var xmpp = require('node-xmpp');
var User = require('./user');
var Router = require('./router');

var Server = function(config){
    this.c2sServer = new xmpp.C2SServer(config);
    this._initRouter(); //init xmpp-server's Router
    this._initAuth();   //init login and register
};

Server.prototype._initAuth = function(){
    var self = this;
    this.c2sServer.on('connect',function(client){
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


        // Allows the developer to authenticate users against anything they want.
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
    });
};

Server.prototype._initRouter = function(){
    Router.configure(this.c2sServer);
    this.router = this.c2sServer.router;
};


module.exports = Server;
