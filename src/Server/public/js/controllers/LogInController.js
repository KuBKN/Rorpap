app.controller('LogInController', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {
    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.user = {};

	$scope.logIn = function() {
		$scope.user.password = CryptoJS.MD5($scope.user.password).toString();
		console.log($scope.user.password);
        $http.post('/api/user/login', $scope.user)
			.success(function(data) {
				$cookies.putObject('_id', data[0]._id);
				$window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    };

}]);
