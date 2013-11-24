var cl = new XMPP.Client({
    //websocketsURL: "ws://0.0.0.0:5280/",
    boshURL: "http://localhost:5333/",
    jid: 'laomao@localhost',
    password: '123456'
});
cl.addListener('online', function() {
    console.log('online');
    ["astro@spaceboyz.net"].forEach( function(to) {
        cl.send(new XMPP.Element('message', {
            to: to,
            type: 'chat'
        }).c('body').t("Hello from browser"));
    });

    // nodejs has nothing left to do and will exit
    cl.end();
});
cl.addListener('error', function(e) {
    console.error(e);
});
