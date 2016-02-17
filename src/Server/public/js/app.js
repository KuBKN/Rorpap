var app = angular.module('rorpap', ['ngRoute', 'ngCookies', 'uiGmapgoogle-maps', 'ngFileUpload']);

app.config(function($routeProvider, $locationProvider ) {

	$routeProvider.when('/',{
		controller: 'HomeController',
        templateUrl: './views/home.html'
	}).when('/about', {
        templateUrl: './views/about.html'
	}).when('/myrequest', {
		controller: 'MyRequestController',
		templateUrl: './views/myrequest.html'
	}).when('/newrequest', {
        controller: 'NewRequestController',
        templateUrl: './views/newrequest.html'
	}).when('/beamessenger', {
		controller: 'BeAMessengerController',
		templateUrl: './views/beamessenger.html'
	}).when('/profile', {
		controller: 'ProfileController',
		templateUrl: './views/profile.html'
	}).when('/findrequest', {
		controller: 'FindRequestController',
		templateUrl: './views/findrequest.html'
	}).when('/myquest', {
		controller: 'MyQuestController',
		templateUrl: './views/myquest.html'
	}).when('/admin', {
		controller: 'AdminController',
		templateUrl: './views/admin.html'
    }).otherwise({ redirectTo: "/" });

});

app.config(function ($locationProvider) {
    $locationProvider.hashPrefix('!');
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.21', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});
