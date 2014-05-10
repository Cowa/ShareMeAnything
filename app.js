var express = require('express'),
    http    = require('http'),
    sio     = require('socket.io');

var app     = express(),
    server  = http.createServer(app),
    io      = sio.listen(server),
    port    = 8080;

/*****************
 ** GET HANDLER **
 *****************/

app.use('/css', express.static(__dirname + '/public/css'))
.use('/js', express.static(__dirname + '/public/js'))
.use('/img', express.static(__dirname + '/public/img'))

.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
})

.get('/share', function(req, res) {
	res.sendfile(__dirname + '/public/share.html');
})

.use(function(req, res, next) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(404, 'Page not found');
});

/*********************
 ** SOCKETS HANDLER **
 *********************/

io.sockets.on('connection', function(socket) {

	// Client disconnects
	socket.on('disconnect', function(message) {
	
		if (wasInRoom(socket)) {
			var room = getRoom(socket);
			socket.leave(room);
			
			updateNbSharingClient();
			updateRoomState(room);
			
			socket.broadcast.to(room).emit('clear_room');
		}
	});
	
	// Client wants to share
	socket.on('new', function() {
	
		if (!wasInRoom(socket)) {
			socket.leave('home');
			joinRoom(socket);
			updateNbSharingClient();
		}
	});
	
	// Client arrives on home page
	socket.on('home', function() {

		if (!wasInRoom(socket)) {
			socket.join('home');
			socket.emit('nb', numberOfClient());
		}
	});
	
	// Client sender sends something from URL
	socket.on('share_any', function(url) {

		if(isSender(socket)) {

			if (isImage(url)) {
				send_image(socket, url);

			} else if (isYoutube(url)) {
				send_video(socket, url, 'youtube');

			} else if (isVimeo(url)) {
				send_video(socket, url, 'vimeo');

			} else {
				socket.emit('share_invalid');
			}
		}
	});

	// Client receiver says 'Fun' to the share (switch role)
	socket.on('fun', function() {
		
		var room = getRoom(socket);
		io.sockets.in(room).emit('clear_room');
		
		switchRole(getRoom(socket));
	});
	
	// Client receiver says 'Bad' to the share (end communication)
	socket.on('bad', function() {
	
		var room = getRoom(socket);
		var roomate = getRoomate(socket, room);
		
		io.sockets.in(room).emit('clear_room');
		
		socket.leave(room);
		roomate.leave(room);
		updateNbSharingClient();
		
		// end of stream, 1 for the client who clicked 'bad', 0 for the other
		socket.emit('eos', '1');
		roomate.emit('eos', '0');
	});
});

server.listen(port);

/***************
 ** FUNCTIONS ** 
 ***************/
 
// Tell clients at Home the number of people sharing
function updateNbSharingClient() {
	io.sockets.in('home').emit('nb', numberOfClient());
}

// Check if the socket is the sender
function isSender(socket) {
	
	var room = getRoom(socket),
		rtrn = false;
	
	for(var cl in io.sockets.clients(room)) {
		io.sockets.clients(room)[cl].get('role', function(err, role) {
			if(role == 'sender' && io.sockets.clients(room)[cl] == socket) rtrn = true;
		});
	}
	
	return rtrn;
}

// Join a room which has less than 2 clients & set role
function joinRoom(socket) {
	
	var i     = 0,
        found = false,
        room  = 'moor';
        role  = 'zombi';
	
	// Join an existing room (with a client already)
	for (var key in io.sockets.manager.rooms) {
		if (key != "/home" && key != "") {
			if (io.sockets.clients(key.substring(1)).length < 2) {
				found = true;
				room = key.substring(1);
				
				io.sockets.clients(room)[0].get('role', function(err, grole) {
					if(grole == 'receiver') role = 'sender';
					else role = 'receiver';
				});
			}
		}
	}
	
	// Join a fresh room
	if (!found) {
		while (roomExists('room' + i)) i++;
		room = 'room' + i;
		role = 'sender';
	}
	
	socket.set('role', role);
	socket.join(room);
	console.log('Client entering ' + room);
	
	updateRoomState(room);
}

// Check if a room exists
function roomExists(room) {
	return (typeof io.sockets.manager.rooms['/' + room] != 'undefined');
}

// Return the number of clients in all rooms
function numberOfClient() {

	var n = 0;
	
	for (var key in io.sockets.manager.rooms) {
		if (key != "/home" && key != "")
			n += io.sockets.clients(key.substring(1)).length;
	}
	
	return n;
}

// Send the state of a room to clients from it (-1: error, 0: alone, 1: ok)
// And tell them which role they got ('sender' or 'receiver')
function updateRoomState(room) {
	
	var msg = -1;
	
	if      (io.sockets.clients(room).length <= 1) msg = 0;
	else if (io.sockets.clients(room).length == 2) msg = 1;

	for(var cl in io.sockets.clients(room)) {
		io.sockets.clients(room)[cl].get('role', function(err, role) {
			io.sockets.clients(room)[cl].emit('role', role);
		});
	}
	
	io.sockets.in(room).emit('room_state', msg)
}

// Check if a client was in a room (and not in home)
function wasInRoom(socket) {
	
	var inRoom = false;
	
	for(var key in io.sockets.manager.roomClients[socket.id]) {
		if (key != "/home" && key != "")
			inRoom = true;
	}
	
	return inRoom;
}

// Return the socket's room name
function getRoom(socket) {

	var room = "room 237";
	
	for(var key in io.sockets.manager.roomClients[socket.id]) {
		if (key != "/home" && key != "")
			room = key.substring(1);
	}
		
	return room;
}

// Switch role, sender becomes receiver & vice versa
function switchRole(room) {
	
	for(var cl in io.sockets.clients(room)) {
		io.sockets.clients(room)[cl].get('role', function(err, role) {
			if(role == 'sender') io.sockets.clients(room)[cl].set('role', 'receiver');
			else io.sockets.clients(room)[cl].set('role', 'sender');
		});
	}

	updateRoomState(room);
}

// Get the room-mate of a socket from a room
function getRoomate(socket, room) {

	var roomate;

	for(var cl in io.sockets.clients(room)) {
		if (socket != io.sockets.clients(room)[cl])
			roomate = io.sockets.clients(room)[cl];
	}

	return roomate;
}

// Check if the given url is an image
function isImage(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// Check if url is a YouTube video
function isYoutube(url) {
	return (url.match(/watch\?v=([a-zA-Z0-9\-_]+)/) != null);
}

// Check if url is a Vimeo video
function isVimeo(url) {
	return (url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/) != null);
}

function send_video(socket, video, type) {

	var room  = getRoom(socket);
	socket.broadcast.to(room).emit('receive_video', video, type);
	socket.emit('share_done', video, type);
}

function send_image(socket, image) {

	var room  = getRoom(socket);
	socket.broadcast.to(room).emit('receive_image', image);
	socket.emit('share_done', image, 'img');
}
