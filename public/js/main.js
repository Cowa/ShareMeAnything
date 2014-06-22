var sma = angular.module('sma', ['ngRoute']);

sma.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'template/lobby.html'
		}).
		when('/share', {
			templateUrl: 'template/share.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}]
);

sma.controller('LobbyController', function($scope, socket) {
	socket.on('People, I updated the number of people in rooms', function(number) {
		$scope.numberOfPeopleInRooms = number;
	});
});

sma.factory('socket', function($rootScope) {
	var socket = io.connect();
	socket.emit('Server, please add me to lobby');
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() { 
				var args = arguments;   
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		}
	};
});
