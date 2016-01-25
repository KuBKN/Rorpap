var app = angular.module('rorpap', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.when('/',{
		controller: 'HomeController',	
        templateUrl: './views/home.html'
        
	}).when('/About',{
        templateUrl: './views/about.html'
	}).when('/My Request',{
		controller: 'MyRequestController',
		templateUrl: './views/myrequest.html'
	}).when('/NewRequest',{
		controller: 'NewRequestController',
		templateUrl: './views/newrequest.html'
	});
});

app.service('loginService',function($window){

	var status = true;

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