app.controller('LogOutController',['$scope', '$cookies', function($scope, $cookies) {
	$scope.logOut = function() {
		$cookies.remove('_id');
    }
}]);
