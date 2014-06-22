var sma = angular.module('sma', ['ngRoute']);

sma.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'template/home.html'
		}).
		when('/share', {
			templateUrl: 'template/share.html'
		}).
		otherwise({
			redirectTo: '/'
		});
	}]
);
