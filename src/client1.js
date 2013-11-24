var xmpp = require('node-xmpp');
var config = require('./cfg');

var clientCuihua= new xmpp.Client({
    jid:"cuihua@"+config.domain,
    password:"123456"
});

clientCuihua.on('online',function(){
    console.log('cuihua online!');
});

 clientCuihua.on('error',function(error){
    console.log(error);
 });


