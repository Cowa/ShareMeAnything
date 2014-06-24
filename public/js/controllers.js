// Lobby controller
sma.controller('LobbyController', function($rootScope, socket) {
	socket.emit('Server, please add me to lobby');
	socket.on('People, I updated the number of people in rooms', function(number) {
		$rootScope.numberOfPeopleInRooms = number;
	});
});

// Room controller
sma.controller('RoomController', function($rootScope, socket) {
	socket.emit('Server, please I want to share');
});
