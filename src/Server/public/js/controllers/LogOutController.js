app.controller('LogOutController',['$scope', '$cookies','$location', '$window', function($scope, $cookies,$location, $window) {
	$scope.logOut = function() {
		$cookies.remove('_id');
		$location.path('/');
		$window.location.reload();
    }
}]);
