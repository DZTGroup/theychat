var cl = new XMPP.Client({
    websocketsURL: "ws://localhost:5222/",
    //boshURL: "https://beta.buddycloud.org/http-bind/",
    jid: 'test@localhost',
    password: '***'
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
