app.controller('LogOutController',['$scope', '$cookies','$window', function($scope, $cookies,$window) {
	$scope.logOut = function() {
		$cookies.remove('_id');
		$window.location.reload();
    }
}]);
