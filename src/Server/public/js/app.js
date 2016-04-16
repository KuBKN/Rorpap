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
	}).when('/messenger', {
		controller: 'MessengerController',
		templateUrl: './views/messenger.html'
	}).when('/profile_other', {
		controller: 'ProfileOtherController',
		templateUrl: './views/profile_other.html'
    }).when('/admin', {
		controller: 'AdminController',
		templateUrl: './views/admin.html'
    }).when('/trackrequest',{
    	controller: 'TrackRequestController',
    	templateUrl: './views/trackrequest.html'
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

app.service('requestColor', function(){
	this.getColor = function(type){
		if (type == 'Pending') {
			return '#FFBCBC';
		} else if (type == 'Reserved') {
			return '#FFE952';
		} else if (type == 'Inprogress') {
			return '#BCBEFF';
		} else {
			return '#BCFFD1';
		};
	}
});

app.service('requestParcelImg', function(){
	var allImgs = [{ url: 'images/parcels/parcel01.jpg',						
						name: 'Paper'},
					{ url: 'images/parcels/parcel02.jpg',						
						name: 'Small'},
					{ url: 'images/parcels/parcel03.jpg',						
						name: 'Flat'},
					{ url: 'images/parcels/parcel04.jpg',						
						name: 'Medium'},
					{ url: 'images/parcels/parcel05.jpg',						
						name: 'Big'},
					{ url: 'images/parcels/parcel06.jpg',						
						name: 'Long'}];	

	this.getAll = function(){
		return allImgs;
	};

	this.getByIndex = function(index){
		return allImgs[index];
	};	
});

app.factory('requestEditor', function() {
  var curReq;
  var seeReq = function(req) {
      curReq = req;
  };

  var getReq = function(){
      return curReq;
  };

  return {
    seeReq: seeReq,
    getReq: getReq
  };
});

app.service('trackingRequest',function(){
	var request;
	this.setRequest = function(req){
		request = req;
	}
	this.getRequest = function(){
		return request;
	}
});