var app = angular.module('rorpap', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		controller: 'HomeController',	
        templateUrl: './views/home.html'
        
	}).when('/About',{
        templateUrl: './views/about.html'
	}).when('/My Request',{
		templateUrl: './views/myrequest.html'
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