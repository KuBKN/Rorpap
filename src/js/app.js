var app = angular.module('rorpap', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		templateUrl: 'views/home.html',
		controller: 'HomeController'
	}).when('/About',{
		templateUrl: 'views/about.html',
		controller: 'AboutController'
	})
});
