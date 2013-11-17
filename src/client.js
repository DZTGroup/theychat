var xmpp = require('node-xmpp');

var client = new xmpp.Client({ 
    jid: "laohei@localhost", 
    password: "laoheishisb"
});

client.on('online', function(data) {
    console.log("laohei online");
    console.log(data.constructor)
});
