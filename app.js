/************
 ** CONFIG **
 ************/
var express  = require('express'),
    http     = require('http'),
    sio      = require('socket.io');

var app      = express(),
    server   = http.createServer(app),
    io       = sio.listen(server),
    port     = 8080;

// Debug mode
var debugMode = false;

if (!debugMode) {
  io.set('log level', 1);
}

/*****************
 ** GET HANDLER **
 *****************/
var indexPage = '/public/index.html',
    cssDir    = '/public/css',
    jsDir     = '/public/js',
    imgDir    = '/public/img';

app.use('/css', express.static(__dirname + cssDir))
   .use('/js', express.static(__dirname + jsDir))
   .use('/img', express.static(__dirname + imgDir))
   .use('/partial', express.static(__dirname + '/public/partial'))

   .get('/', function(req, res) {
      res.sendfile(__dirname + indexPage);
   })

   .use(function(req, res, next) {
      res.setHeader('Content-Type', 'text/plain');
      res.send(404, 'Page not found');
   });

/*********************
 ** SOCKETS HANDLER **
 *********************/

io.sockets.on('connection', function(socket) {

	// People disconnect
	socket.on('disconnect', function(message) {

		if (wasInRoom(socket)) {
			var room = getRoom(socket);
			socket.leave(room);

			updateNumberOfPeopleInRooms();
			updateRoomState(room);
		}
	});

	// People want to share
	socket.on('Server, please I want to share', function() {

		if (!wasInRoom(socket)) {
			socket.leave('lobby');
			joinRoom(socket);
			updateNumberOfPeopleInRooms();
		}
	});

	// People want to get into the lobby
	socket.on('Server, please add me to lobby', function() {

		if (wasInRoom(socket)) {
			var room = getRoom(socket);
			socket.leave(room);
		}
		socket.join('lobby');
		socket.emit('People, I updated the number of people in rooms', numberOfPeopleInRooms());
	});

	// People sender send something from URL
	socket.on('Server, I shared something from an URL', function(url) {

		if(isSender(socket)) {

			if (isImage(url)) {
				sendImage(socket, url);

			} else if (isYoutube(url)) {
				sendVideo(socket, url, 'youtube');

			} else if (isVimeo(url)) {
				sendVideo(socket, url, 'vimeo');

			} else {
				socket.emit('People, sorry but your share seems invalid');
			}
		}
	});

	// People share a photo from its camera
	socket.on('Server, here\'s a photo from my camera', function(photo) {
		sendImage(socket, photo);
	});

	// People share an uploaded image
	socket.on('Server, here\'s an image I uploaded', function(image) {
		sendImage(socket, image);
	});

	// People share a draw
	socket.on('Server, here\'s a home-made draw', function(draw) {
		sendImage(socket, draw);
	});

	// People receiver say 'Fun' to the share (switch role)
	socket.on('Server, the share was fun !', function() {

		var room = getRoom(socket);

		switchRole(getRoom(socket));
		socket.broadcast.to(room).emit('People, your share was fun !');
	});

	// People receiver say 'Bad' to the share (end communication)
	socket.on('Server, the share was bad...', function() {

		var room    = getRoom(socket);
		var roomate = getRoomate(socket, room);

		socket.leave(room);
		roomate.leave(room);
		updateNumberOfPeopleInRooms();

		socket.emit('People, sorry but this is the end...', 'You didn\'t like the share');
		roomate.emit('People, sorry but this is the end...', 'Your share was bad');
	});
});

server.listen(port);

/***************
 ** FUNCTIONS **
 ***************/

// Tell people at the lobby the number of people in rooms
function updateNumberOfPeopleInRooms() {
	io.sockets.in('lobby').emit('People, I updated the number of people in rooms', numberOfPeopleInRooms());
}

// Check if the people is the sender
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

// Join a room which has less than 2 people & set role
function joinRoom(socket) {

	var i     = 0,
	    found = false,
	    room  = '';
	    role  = '';

	// Join an existing room (with a people already in)
	for (var key in io.sockets.manager.rooms) {
		if (key != '/lobby' && key != '') {
			if (io.sockets.clients(key.substring(1)).length < 2) {
				found = true;
				room  = key.substring(1);

				io.sockets.clients(room)[0].get('role', function(err, grole) {
					if (grole == 'receiver') role = 'sender';
					else                     role = 'receiver';
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
	console.log('People entering ' + room);

	updateRoomState(room);
}

// Check if a room exists
function roomExists(room) {
	return (typeof io.sockets.manager.rooms['/' + room] != 'undefined');
}

// Return the number of people in all rooms
function numberOfPeopleInRooms() {

	var n = 0;

	for (var key in io.sockets.manager.rooms) {
		if (key != '/lobby' && key != '')
			n += io.sockets.clients(key.substring(1)).length;
	}

	return n;
}

// Send the state of a room to people in it (-1: error, 0: alone, 1: ok)
function updateRoomState(room) {

	var state = -1;

	if      (io.sockets.clients(room).length <= 1) state = 0;
	else if (io.sockets.clients(room).length == 2) state = 1;

	tellTheirRole(room);
	io.sockets.in(room).emit('People, here\'s the state of your room', state);
}

// Send their role to people inside a room
function tellTheirRole(room) {

	for(var cl in io.sockets.clients(room)) {
		io.sockets.clients(room)[cl].get('role', function(err, role) {
			io.sockets.clients(room)[cl].emit('People, this is your role', role);
		});
	}
}

// Check if a people was in a room (and not in lobby)
function wasInRoom(socket) {

	var inRoom = false;

	for(var key in io.sockets.manager.roomClients[socket.id]) {
		if (key != '/lobby' && key != '')
			inRoom = true;
	}

	return inRoom;
}

// Return the people's room name
function getRoom(socket) {

	var room = 'room 237';

	for(var key in io.sockets.manager.roomClients[socket.id]) {
		if (key != '/lobby' && key != '')
			room = key.substring(1);
	}

	return room;
}

// Switch role, sender becomes receiver & vice versa
function switchRole(room) {

	for(var cl in io.sockets.clients(room)) {
		io.sockets.clients(room)[cl].get('role', function(err, role) {
			if (role == 'sender') io.sockets.clients(room)[cl].set('role', 'receiver');
			else                  io.sockets.clients(room)[cl].set('role', 'sender');
		});
	}

	updateRoomState(room);
}

// Get the room-mate of a people from a room
function getRoomate(socket, room) {

	var roomate;

	for(var cl in io.sockets.clients(room)) {
		if (socket != io.sockets.clients(room)[cl])
			roomate = io.sockets.clients(room)[cl];
	}

	return roomate;
}

// Check if the url is an image
function isImage(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// Check if the url is a YouTube video
function isYoutube(url) {
	return (url.match(/watch\?v=([a-zA-Z0-9\-_]+)/) != null);
}

// Check if url is a Vimeo video
function isVimeo(url) {
	return (url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/) != null);
}

function sendVideo(socket, video, type) {

	var room = getRoom(socket);
	socket.broadcast.to(room).emit('People, this video was sent for you', video, type);
	shareDone(socket, video, type);
}

function sendImage(socket, image) {

	var room = getRoom(socket);
	socket.broadcast.to(room).emit('People, this image was sent for you', image);
	shareDone(socket, image, 'image');
}

function shareDone(socket, share, type) {
	socket.emit('People, your share was sent', share, type);
}
