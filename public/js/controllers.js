/**
 * Lobby controller
 */
sma.controller('LobbyController', function($rootScope, $state, socket) {
	socket.emit('Server, please add me to lobby');
	socket.on('People, I updated the number of people in rooms', function(number) {
		$rootScope.numberOfPeopleInRooms = number;
	});
});

/**
 * Waiting room controller
 */
sma.controller('WaitingController', function($rootScope, $state, socket) {
	socket.emit('Server, please I want to share');

	socket.on('People, here\'s the state of your room', function(stateOfRoom) {
		if (stateOfRoom == 1) {
			$state.transitionTo('room');
		}
	});

	// TODO (server side) : Only emit role when room is full
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

/**
 * Room controller
 */
sma.controller('RoomController', function($rootScope, $state, socket) {
	$rootScope.shared  = false;
	$rootScope.wait    = true;

	socket.emit('Server, please I want to share');

	socket.on('People, here\'s the state of your room', function(stateOfRoom) {
		if (stateOfRoom == 0) {
			$state.transitionTo('waiting');
		}
	});

	socket.on('People, this is your role', function(role) {
		$rootScope.shared = false;
		$rootScope.wait   = true;

		if (role == 'sender') {
			$rootScope.sender   = true;
			$rootScope.receiver = false;
		} else if (role == 'receiver') {
			$rootScope.sender   = false;
			$rootScope.receiver = true;
		}

		putLastShareInHistory();
	});

	socket.on('People, this image was sent for you', function(image) {
		if ($rootScope.wait) {
			$('#receivedShare').append('<img src="' + image + '"/>');
		}
		$rootScope.wait = false;
	})

	socket.on('People, sorry but this is the end...', function(msg) {
		$state.transitionTo('end');
	});

	socket.on('People, your share was sent', function(share, type) {
		if (!$rootScope.shared) {
			$rootScope.shared = true;
			if (type == 'image' || type == 'photo') {	
				$('#sentShare').append('<img src="' + share + '"/>');
			}
		}
	});

	$rootScope.voteFun = function() {
		socket.emit('Server, the share was fun !');
	};

	$rootScope.voteBad = function() {
		socket.emit('Server, the share was bad...');
	};

	var putLastShareInHistory = function() {
		$("#sentShare").children().appendTo("#history");
		$("#receivedShare").children().appendTo("#history");
	};
});

/**
 * Image controller
 */
sma.controller('CameraController', function($scope, $rootScope, $state, socket) {
	$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
	$scope.snap    = false;

	$scope.onError = function (err) {
	};

	$scope.onSuccess = function(videoElem) {
		video = videoElem;
		$scope.$apply(function() {
			$scope.patOpts.w = video.width;
			$scope.patOpts.h = video.height;
		});
	};

	$scope.onStream = function (stream, videoElem) {
	};

	$scope.takePhoto = function() {
		$scope.snap = true;
		if (video) {
			var takenPhoto = $('#takenPhoto')[0];
			if (!takenPhoto) return;

			takenPhoto.width  = video.width;
			takenPhoto.height = video.height;
			var ctx = takenPhoto.getContext('2d');

			var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y,
			                         $scope.patOpts.w, $scope.patOpts.h);

			ctx.putImageData(idata, 0, 0);
		}
	};

	$scope.sharePhoto = function() {
		var photo = $('#takenPhoto')[0].toDataURL('image/webp');
		socket.emit('Server, here\'s a photo from my camera', photo);
	};

	var getVideoData = function(x, y, w, h) {
		var canvas    = document.createElement('canvas');
		canvas.width  = video.width;
		canvas.height = video.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, video.width, video.height);

		return ctx.getImageData(x, y, w, h);
	};
});

/**
 * Image controller
 */
sma.controller('ImageController', function($scope, $rootScope, $state, $upload, socket) {
	$scope.onFileSelect = function($files) {
		var data   = $files[0];
		var reader = new FileReader();

		reader.onload = function(evt) {
			var image = evt.target.result;
			socket.emit('Server, here\'s an image I uploaded', image);
		};
		reader.onloadend = (function() {
		});

		reader.readAsDataURL(data);
	};
});
