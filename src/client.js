var xmpp = require('node-xmpp');
var config = require('./cfg');
var AUTH_ERROR = "XMPP authentication failure";
var clientLaohei = new xmpp.Client({
    jid: "laohei@"+config.domain,
    password: "laoheishisb"
});

var clientLaomao = new xmpp.Client({
    jid:"laomao@"+config.domain,
    password:"laomaoshisb"
});


clientLaohei.on('online', function(data) {
    console.log("laohei online");
    clientLaohei.send(new xmpp.Message({to:"laomao@localhost"}).c('body').t('xxx'));
});
clientLaohei.on('error',function(error){
    if(error==AUTH_ERROR){
        console.log("author error");
    }
});

clientLaomao.on('stanza',function(stanza){
    console.log('laomao receive:',stanza.getChildText('body'));
});
clientLaomao.on('online',function(){
    console.log('laomao online');
});
clientLaomao.on('error',function(error){
    if(error==AUTH_ERROR){
        console.log("author error");
    }
});
