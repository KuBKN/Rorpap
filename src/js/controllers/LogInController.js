app.controller('LogInController',['$scope','$uibModalInstance','loginService',function($scope,$uibModalInstance,loginService){
	$scope.logIn = function(){
		loginService.login();
		$uibModalInstance.close();
	};
}]);