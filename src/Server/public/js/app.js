var app = angular.module('rorpap', ['ngRoute', 'ngCookies','uiGmapgoogle-maps']);

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

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});