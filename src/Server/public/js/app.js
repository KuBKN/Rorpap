var app = angular.module('rorpap', ['ngRoute', 'ngCookies', 'ngFileUpload', 'ngMap', 'ngAnimate']);

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
	}).when('/profile_other', {
		controller: 'ProfileOtherController',
		templateUrl: './views/profile_other.html'
    }).when('/admin', {
		controller: 'AdminController',
		templateUrl: './views/admin.html'
    }).otherwise({ redirectTo: "/" });

});

app.config(function ($locationProvider) {
    $locationProvider.hashPrefix('!');
});

app.factory('loadUser',['$http', '$cookies', function($http, $cookies){

	var isLogIned = function(){
		return $cookies.get('_id') != undefined;
	}
    
    var getUser = function(id){
    	if(id == undefined){
	    	id = $cookies.get('_id').replace(/\"/g, '');
	    }
    	return $http.get('/api/user/get/' + id)
	    .then(function(response) {
	        return response.data[0];
		});
    } 

    return { isLogIned: isLogIned, getUser: getUser };
}]);

app.factory('profileViewer', function() {
  var curUser;
  var seeUser = function(user) {
      curUser = user;
  };

  var getUser = function(){
      return curUser;
  };

  return {
    seeUser: seeUser,
    getUser: getUser
  };

});