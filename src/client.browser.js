var cl = new XMPP.Client({
    //websocketsURL: "ws://0.0.0.0:5280/",
    boshURL: "http://localhost:5333/",
    jid: 'laomao@localhost',
    password: '123456'
});

//cl.connection.socket.setTimeout(0);
//cl.connection.socket.setKeepAlive(true, 10000);
cl.addListener('online', function() {
    console.log('client from browser online...');
    cl.send(new XMPP.Message({ type: 'chat' }).c('body').t('Hello there, little server.'));

    // nodejs has nothing left to do and will exit
    //cl.end();
});
cl.addListener('error', function(e) {
    console.error(e);
});

cl.addListener('stanza', function(stanza) {
    console.log('STANZA' + stanza);
});
