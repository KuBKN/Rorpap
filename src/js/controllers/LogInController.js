app.controller('LogInController',['$scope','loginService',function($scope,loginService){
	$scope.logIn = function(){
		loginService.login();
	};
}]);