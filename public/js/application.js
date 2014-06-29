var sma = angular.module('sma', ['ui.router', 'webcam']);

// Routing
sma.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('lobby', {
			url: '/',
			templateUrl: 'partial/lobby.html',
			controller : 'LobbyController'
		})
		.state('waiting', {
			url: '/waiting',
			templateUrl: 'partial/waiting.html',
			controller : 'WaitingController'
		})
		.state('room', {
			url: '/room',
			templateUrl: 'partial/room/room.html',
			controller : 'RoomController'
		})
		.state('room.camera', {
			url: '/camera',
			templateUrl: 'partial/room/camera.html',
			controller : 'CameraController'
		})
		.state('room.image', {
			url: '/image',
			templateUrl: 'partial/room/image.html'
		})
		.state('room.draw', {
			url: '/draw',
			templateUrl: 'partial/room/draw.html'
		})
		.state('room.url', {
			url: '/url',
			templateUrl: 'partial/room/url.html'
		})
		.state('end', {
			url: '/end',
			templateUrl: 'partial/end.html'
		});
		$urlRouterProvider.otherwise('/');
	}]
);

// Service to 'connect' AngularJS with Socket.IO
sma.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() { 
				var args = arguments;   
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});
