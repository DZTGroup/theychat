(function($){

	// create global app parameters...
	var NAME_MAX_LENGTH = 15,
		ROOM_MAX_LENGTH = 10,
		lockShakeAnimation = false,
		socket = null,
		clientId = null,
		user = null,
        cl=null,

		// holds the current room we are in
		currentRoom = null,

		// server information
		serverAddress = 'http://localhost',
		serverDisplayName = 'Server',
		serverDisplayColor = '#1c5380',

		// some templates we going to use in the chat,
		// like message row, client and room, this
		// templates will be rendered with jQuery.tmpl
		tmplt = {
			room: [
				'<li data-roomId="${room}">',
					'<span class="icon"></span> ${room}',
				'</li>'
			].join(""),
			client: [
				'<li data-clientId="${clientId}" class="cf">',
					'<div class="fl clientName"><span class="icon"></span> ${nickname}</div>',
					'<div class="fr composing"></div>',
				'</li>'
			].join(""),
			message: [
				'<li class="cf">',
					'<div class="fl sender">${sender}: </div><div class="fl text">${text}</div><div class="fr time">${time}</div>',
				'</li>'
			].join("")
		};

	// bind DOM elements like button clicks and keydown
	function bindDOMEvents(){
		
		$('.chat-input input').on('keydown', function(e){
			var key = e.which || e.keyCode;
			if(key == 13) { handleMessage(); }
		});

		$('.chat-submit button').on('click', function(){
			handleMessage();
		});

		$('#login-popup .begin').on('click', function(){
			handleLogIn();
		});


		$('.big-button-green.start').on('click', function(){
			$('#login-popup .input input').val('');
			Avgrund.show('#login-popup');
			window.setTimeout(function(){
	        	$('#login-popup .input input[type="text"]').focus();
	        },100);
		});

		$('.chat-messages').on('scroll', function(){
			var self = this;
			window.setTimeout(function(){
				if($(self).scrollTop() + $(self).height() < $(self).find('ul').height()){
					$(self).addClass('scroll');
				} else {
					$(self).removeClass('scroll');
				}
			}, 50);
		});

	}

	// bind socket.io event handlers
	// this events fired in the server
	function bindSocketEvents(){

		// when the connection is made, the server emiting
		// the 'connect' event
		socket.on('connect', function(){
			// firing back the connect event to the server
			// and sending the nickname for the connected client
			socket.emit('connect', { nickname: nickname });
		});
		
		// after the server created a client for us, the ready event
		// is fired in the server with our clientId, now we can start 
		socket.on('ready', function(data){
			// hiding the 'connecting...' message
			$('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
				$(this).hide();
				$('.chat input').focus();
			});
			
			// saving the clientId localy
			clientId = data.clientId;
		});


		// when someone sends a message, the sever push it to
		// our client through this event with a relevant data
		socket.on('chatmessage', function(data){
			var nickname = data.client.nickname;
			var message = data.message;
			
			//display the message in the chat window
			insertMessage(nickname, message, true, false, false);
		});
		
		// when we subscribes to a room, the server sends a list
		// with the clients in this room
		socket.on('roomclients', function(data){
			
			// add the room name to the rooms list
			addRoom(data.room, false);

			// set the current room
			setCurrentRoom(data.room);
			
			// announce a welcome message
			insertMessage(serverDisplayName, 'Welcome to the room: `' + data.room + '`... enjoy!', true, false, true);
			$('.chat-clients ul').empty();
			
			// add the clients to the clients list
			addClient({ nickname: nickname, clientId: clientId }, false, true);
			for(var i = 0, len = data.clients.length; i < len; i++){
				if(data.clients[i]){
					addClient(data.clients[i], false);
				}
			}

			// hide connecting to room message message
			$('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
				$(this).hide();
				$('.chat input').focus();
			});
		});

		
		// with this event the server tells us when a client
		// is connected or disconnected to the current room
		socket.on('presence', function(data){
			if(data.state == 'online'){
				addClient(data.client, true);
			} else if(data.state == 'offline'){
				removeClient(data.client, true);
			}
		});
	}


	// add a client to the clients list
	function addClient(client, announce, isMe){
		var $html = $.tmpl(tmplt.client, client);
		
		// if this is our client, mark him with color
		if(isMe){
			$html.addClass('me');
		}

		// if announce is true, show a message about this client
		if(announce){
			insertMessage(serverDisplayName, client.nickname + ' has joined the room...', true, false, true);
		}
		$html.appendTo('.chat-clients ul')
	}

	// remove a client from the clients list
	function removeClient(client, announce){
		$('.chat-clients ul li[data-clientId="' + client.clientId + '"]').remove();
		
		// if announce is true, show a message about this room
		if(announce){
			insertMessage(serverDisplayName, client.nickname + ' has left the room...', true, false, true);
		}
	}


	// save the client nickname and start the chat by
	// calling the 'connect()' function
	function handleLogIn(){
		var userName = $('#login-popup .input #username').val().trim();
        var passwd=$('#login-popup .input #passwd').val().trim();
		if(userName && userName.length <= NAME_MAX_LENGTH){
			user = userName;
			Avgrund.hide();
			connect(user,passwd);
		} else {
			shake('#login-popup', '#login-popup .input input', 'tada', 'yellow');
			$('#login-popup .input input').val('');
		}
	}

	// handle the client messages
	function handleMessage(){
		var message = $('.chat-input input').val().trim();
		if(message){

			// send the message to the server with the room name


            cl.send(new XMPP.Message({from:user, type: 'chat' }).c('body').t(message));
			// display the message in the chat window
			insertMessage(user, message, true, true);
			$('.chat-input input').val('');
		} else {
			shake('.chat', '.chat input', 'wobble', 'yellow');
		}
	}

	// insert a message to the chat window, this function can be
	// called with some flags
	function insertMessage(sender, message, showTime, isMe, isServer){
		var $html = $.tmpl(tmplt.message, {
			sender: sender,
			text: message,
			time: showTime ? getTime() : ''
		});

		// if isMe is true, mark this message so we can
		// know that this is our message in the chat window
		if(isMe){
			$html.addClass('marker');
		}

		// if isServer is true, mark this message as a server
		// message
		if(isServer){
			$html.find('.sender').css('color', serverDisplayColor);
		}
		$html.appendTo('.chat-messages ul');
		$('.chat-messages').animate({ scrollTop: $('.chat-messages ul').height() }, 100);
	}

	// return a short time format for the messages
	function getTime(){
		var date = new Date();
		return (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()) + ':' +
				(date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes());
	}

	// just for animation
	function shake(container, input, effect, bgColor){
		if(!lockShakeAnimation){
			lockShakeAnimation = true;
			$(container).addClass(effect);
			$(input).addClass(bgColor);
			window.setTimeout(function(){
				$(container).removeClass(effect);
				$(input).removeClass(bgColor);
				$(input).focus();
				lockShakeAnimation = false;
			}, 1500);
		}
	}
	
	// after selecting a nickname we call this function
	// in order to init the connection with the server
	function connect(user,passwd){

        cl = new XMPP.Client({
            //websocketsURL: "ws://0.0.0.0:5280/",
            boshURL: "http://localhost:5333/",
            jid: user+'@localhost',
            password: passwd
        });

        cl.addListener('online', function(data) {
            console.log('client from browser online...');
            $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                $(this).hide();
                $('.chat input').focus();
            });

            // saving the clientId localy
            clientId = data.clientId;
        });

        //there is something wrong here, need to fix later --by wq
        cl.addListener('error', function(e) {
            shake('#login-popup', '#login-popup .input input', 'tada', 'yellow');
            $('#login-popup .input input').val('');
        });

        cl.on('stanza', function(stanza) {
            console.log(stanza);
            insertMessage(stanza.attrs.from,stanza.children[0].children[0]);

        });

	}

	// on document ready, bind the DOM elements to events
	$(function(){
		bindDOMEvents();
	});

})(jQuery);