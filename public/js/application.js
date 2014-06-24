var sma = angular.module('sma', ['ui.router']);

// Routing
sma.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('lobby', {
			url: "/",
			templateUrl: "template/lobby.html",
			controller : "LobbyController"
		})
		.state('room', {
			url: "/room",
			templateUrl: "template/room.html",
			controller : "RoomController"
		});
		$urlRouterProvider.otherwise("/");
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
