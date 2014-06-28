// Lobby controller
sma.controller('LobbyController', function($rootScope, $state, socket) {
	socket.emit('Server, please add me to lobby');
	socket.on('People, I updated the number of people in rooms', function(number) {
		$rootScope.numberOfPeopleInRooms = number;
	});
});

// Waiting room controller
sma.controller('WaitingController', function($rootScope, $state, socket) {
	socket.emit('Server, please I want to share');

	socket.on('People, here\'s the state of your room', function(stateOfRoom) {
		if (stateOfRoom == 1) {
			$state.transitionTo('room');
		}
	});

	// TODO : Only emit role when room is full
	// So it will avoid this duplicated code below
	socket.on('People, this is your role', function(role) {
		if (role == 'sender') {
			$rootScope.sender   = true;
			$rootScope.receiver = false;
		} else if (role == 'receiver') {
			$rootScope.sender   = false;
			$rootScope.receiver = true;
		}
	});
});

// Room controller
sma.controller('RoomController', function($rootScope, $state, socket) {
	socket.emit('Server, please I want to share');

	socket.on('People, here\'s the state of your room', function(stateOfRoom) {
		if (stateOfRoom == 0) {
			$state.transitionTo('waiting');
		}
	});

	socket.on('People, this is your role', function(role) {
		if (role == 'sender') {
			$rootScope.sender   = true;
			$rootScope.receiver = false;
		} else if (role == 'receiver') {
			$rootScope.sender   = false;
			$rootScope.receiver = true;
		}
	});
});

// Camera controller
sma.controller('CameraController', function($rootScope, $state) {
	$rootScope.setCamera = function() {
		media       = null,
		video       = document.querySelector('video'),
		canvas      = $('#takenPhoto')[0],
		photoHolder = canvas.getContext('2d');

		var camConfig = {
			'video': true
		};

		if (navigator.getUserMedia) {
			navigator.getUserMedia(camConfig, function(stream) {
				video.src = window.URL.createObjectURL(stream);
				media = stream;
			}, function() {
				console.log('Refused to access camera.');
			});
		} else {
			console.log('No camera support.');
			video.src = 'none';
		}
	};
});
