var xmpp = require("node-xmpp");

var c2s = new xmpp.C2SServer({
    port: 5222,
    domain: 'localhost'//,
    // tls: {
    //     keyPath: './examples/localhost-key.pem',
    //     certPath: './examples/localhost-cert.pem'
    // }

});

// On Connect event. When a client connects.
c2s.on("connect", function(client) {
    // That's the way you add mods to a given server.

    // Allows the developer to register the jid against anything they want
    c2s.on("register", function(opts, cb) {
        console.log("REGISTER");
        cb(true);
    });

    // Allows the developer to authenticate users against anything they want.
    client.on("authenticate", function(opts, cb) {
        console.log(opts);
        console.log("AUTH" + opts.jid + " -> " +opts.password); 
        cb(null); // cb(false);
    });

    client.on("online", function() {
        console.log("ONLINE");
        client.send(new xmpp.Message({ type: 'chat' }).c('body').t("Hello there, little client."));
    });

    // Stanza handling
    client.on("stanza", function(stanza) {
        console.log("STANZA" + stanza);
    });

    // On Disconnect event. When a client disconnects
    client.on("disconnect", function(client) {
        console.log("DISCONNECT");
    });

});