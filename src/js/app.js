var app = angular.module('rorpap', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		controller: 'HomeController',	
        templateUrl: './views/home.html'
        
	}).when('/About',{
		controller: 'AboutController',
        templateUrl: './views/about.html'
	});
});

app.service('loginService',function($window){

	var status = false;

	var login = function(){
		status = true;
		$window.location.reload();
	};

	var logout = function(){
		status = false;
	};

	return {
		status : status,
		login : login,
		logout : logout
	};
});