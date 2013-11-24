var xmpp = require('node-xmpp'); 
var config = require('./cfg');

var clientLaomao = new xmpp.Client({
  jid:"laomao@"+config.domain,
  password:"123456"
}); 

clientLaomao.on('online',function(){
  console.log('laomao online');
  online();
});

clientLaomao.on('stanza',function(stanza){ 
  console.log('laomao receive:',stanza.getChildText('body'));
});

clientLaomao.on('error',function(error){
  console.log(error);
});

