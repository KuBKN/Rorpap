app.controller('LogOutController', ['$scope', '$rootScope', '$cookies', '$location', '$window', function($scope, $rootScope, $cookies, $location, $window) {
	$scope.logOut = function() {
		$cookies.remove('_id');
		$rootScope.logIned = false;
		$location.path('/');
		$window.location.reload();
    }
}]);
