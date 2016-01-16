var app = angular.module('rorpap', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		controller: 'HomeController',	
        templateUrl: './views/home.html'
        
	}).when('/About',{
		controller: 'AboutController',
        templateUrl: './views/about.html'
	}).when('/Sign Up',{
		templateUrl: './views/signUp.html'
	});
});
