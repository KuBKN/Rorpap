var app = angular.module('rorpap', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		controller: 'HomeController',
        templateUrl: './views/home.html'

	}).when('/About',{
        templateUrl: './views/about.html'
	}).when('/MyRequest',{
		controller: 'MyRequestController',
		templateUrl: './views/myrequest.html'
	}).when('/NewRequest',{
        controller: 'NewRequestController',
        templateUrl: './views/newrequest.html'
    });
});
