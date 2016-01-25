app.controller('LogInController', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {
    $scope.user = {};

	$scope.logIn = function() {
		console.log($scope.user);
        $http.post('/api/user/login', $scope.user)
			.success(function(data) {
				$cookies.put('_id', data[0]._id);
				console.log($cookies.get('_id'));
				$window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    }
}]);
