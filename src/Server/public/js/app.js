var app = angular.module('rorpap', ['ngRoute', 'ngCookies', 'ngFileUpload', 'ngMap', 'ngAnimate']);

app.config(function($routeProvider, $locationProvider ) {

	$routeProvider.when('/',{
		controller: 'HomeController',
        templateUrl: './views/home.html'
	}).when('/about', {
        templateUrl: './views/about.html'
	}).when('/myrequest', {
		controller: 'MyRequestController',	
		templateUrl: './views/myrequest.html',
		resolve:{
	        "check":function(loadUser,$location){   	        	
	            if(!loadUser.isLogIned()){ 
	                $location.path('/');    //redirect user to home.
	                alert("You don't have access here")
	            }
	        }
        }
	}).when('/newrequest', {
        controller: 'NewRequestController',
        templateUrl: './views/newrequest.html'
	}).when('/beamessenger', {
		controller: 'BeAMessengerController',
		templateUrl: './views/beamessenger.html'
	}).when('/profile', {
		controller: 'ProfileController',
		templateUrl: './views/profile.html',
		resolve:{
	        "check":function(loadUser,$location){   	        	
	            if(!loadUser.isLogIned()){ 
	                $location.path('/');    //redirect user to home.
	                alert("You don't have access here")
	            }
	        }
        }
	}).when('/findrequest', {
		controller: 'FindRequestController',
		templateUrl: './views/findrequest.html',
		resolve:{
	        "check":function(loadUser,$location){   	        	
	            if(!loadUser.isLogIned()){ 
	                $location.path('/');    //redirect user to home.
	                alert("You don't have access here")
	            }
	        }
        }
	}).when('/messenger', {
		controller: 'MessengerController',
		templateUrl: './views/messenger.html',
		resolve:{
	        "check":function(loadUser,$location){   	        	
	            if(!loadUser.isLogIned()){ 
	                $location.path('/');    //redirect user to home.
	                alert("You don't have access here")
	            }
	        }
        }
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

app.service('mailMessage',function(){

	var sendTokenToRec = function(req){ 
		return {email: req.recipient_email,
				topic: 'Receive Token',
				html: '<h4>Hello, Your shipment has started!</h4><br>You can track your shipment by using this tracking number.<br><label style="background-color: yellow">'+req._id+'</label><br><br>Please use this token to receive your parcel.<br><h2><label style="background-color: yellow">'+'Send'+'</label></h2>'}
			}
	var sendAbandonToRec = function(req){ 
		return {email: req.recipient_email,
				topic: 'Request Abandoned',
				html: '<h4>Hello, Your shipment has been canceled!</h4><br>Please wait until the next messenger get this shipment<br>Request No. <label style="background-color: yellow">'+req._id+'</label>'}
			}
	
	this.getMessage = function(type,request){
		if(type=="sendTokenToRec"){
			return sendTokenToRec(request) }
		else if(type=="sendAbandonToRec"){
			return sendAbandonToRec(request) }
	}
});