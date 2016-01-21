app.controller('HeaderController',['$scope','loginService',function($scope,loginService){

	$scope.logIned = loginService.status;
	$scope.orderBy = 'order';

}]);