app.controller('LogOutController',['$scope','loginService',function($scope,loginService){
	$scope.logIn = function(){
		loginService.login();
	};
}]);