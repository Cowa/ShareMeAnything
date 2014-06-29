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
sma.controller('CameraController', function($rootScope, $state, socket) {
	$rootScope.patOpts = {x: 0, y: 0, w: 25, h: 25};
	$rootScope.snap    = false;

	$rootScope.onError = function (err) {

	};

	$rootScope.onSuccess = function(videoElem) {
		video = videoElem;
		$rootScope.$apply(function() {
			$rootScope.patOpts.w = video.width;
			$rootScope.patOpts.h = video.height;
		});
	};

	$rootScope.onStream = function (stream, videoElem) {

	};

	$rootScope.takePhoto = function() {

		$rootScope.snap = true;
		if (video) {
			var takenPhoto = $('#takenPhoto')[0];
			if (!takenPhoto) return;

			socket.emit('Taking photo');
			takenPhoto.width = video.width;
			takenPhoto.height = video.height;
			var ctx = takenPhoto.getContext('2d');

			var idata = getVideoData($rootScope.patOpts.x, $rootScope.patOpts.y, $rootScope.patOpts.w, $rootScope.patOpts.h);
			ctx.putImageData(idata, 0, 0);

			patData = idata;
		}
	};

	var getVideoData = function getVideoData(x, y, w, h) {
		var hiddenCanvas = document.createElement('canvas');
		hiddenCanvas.width = video.width;
		hiddenCanvas.height = video.height;
		var ctx = hiddenCanvas.getContext('2d');
		ctx.drawImage(video, 0, 0, video.width, video.height);
		return ctx.getImageData(x, y, w, h);
	};
});
