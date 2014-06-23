var sma = angular.module('sma', ['ngRoute']);

// Routing
sma.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'template/lobby.html',
			controller : 'LobbyController'
		}).
		when('/share', {
			templateUrl: 'template/share.html',
			controller : 'RoomController'
		}).
		otherwise({
			redirectTo: '/'
		});
	}]
);

// Connect AngularJS with Socket.IO
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
