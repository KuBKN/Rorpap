app.controller('LogInController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
    $scope.user = {};

	$scope.logIn = function() {
		console.log($scope.user);
        $http.post('/api/user/login', $scope.user)
			.success(function(data) {
				$cookies.put('_id', data[0]._id);
				console.log($cookies.get('_id'));
			})
			.error(function(data) {
				console.log(data);
			});
    }
}]);
