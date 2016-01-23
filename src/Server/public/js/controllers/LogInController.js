app.controller('LogInController',['$scope', '$http', '$cookies', function($scope, $http, $cookies){
	$scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    $scope.user = {};

	$scope.logIn = function() {
		console.log($scope.user);
        $http.post('/api/user/login', $scope.user)
			.success(function(data) {
				$cookies.putObject('_id', data[0]._id);
				console.log($cookies.get('_id'));
			})
			.error(function(data) {
				console.log(data);
			});
    }
}]);
