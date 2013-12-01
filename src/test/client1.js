var xmpp = require('node-xmpp');
var config = require('./../cfg');

var clientCuihua= new xmpp.Client({
    jid:"cuihua@"+config.domain,
    password:"123456"
});

clientCuihua.on('online',function(){
    console.log('cuihua online!');
    clientCuihua.send(new xmpp.Message({ type: 'chat' }).c('body').t('Hello there, little server.'));
});

 clientCuihua.on('error',function(error){
    console.log(error);
 });

clientCuihua.on('stanza', function(stanza) {
    connection.write(stanza.children[1].children);
    console.log("hahahhahahah");
});


